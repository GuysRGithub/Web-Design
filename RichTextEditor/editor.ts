export interface ExecCommandStyle {
    style: 'color' |
    'background-color' |
    'font-size' |
    'font-weight' |
    'font-style' |
    'text-decoration';
    value: string,
    initial: (element: HTMLElement | null) => Promise<boolean>
}

export async function execCommandStyle(action: ExecCommandStyle, containers: string) {
    const selection: Selection | null = await getSelection();

    if (!selection) return;
    // String selectioned
    const anchorNode: Node = selection.anchorNode;

    if (!anchorNode) {
        return;
    }

    const container: HTMLElement = anchorNode.nodeType !== Node.TEXT_NODE
        && anchorNode.nodeType !== Node.COMMENT_NODE ? (anchorNode as HTMLElement) : anchorNode.parentElement;

    const sameSelection: boolean = container && container.innerText === selection.toString()

    if (sameSelection && !isContainer(containers, container) && container.style[action.style] !== undefined) {
        await updateSelection(container, action, containers)

        return;
    }

    await replaceSelection(container, action, selection, containers)
}

async function getSelection(): Promise<Selection | null> {
    if (window && window.getSelection) {
        return window.getSelection();
    } else if (document && document.getSelection) {
        return document.getSelection();
    } else if (document && (document as any).selection) {
        return (document as any).selection.createRange().text;
    }

    return null;
}


async function updateSelection(container: HTMLElement, action: ExecCommandStyle, containers: string) {
    container.style[action.style] = await getStyleValue(container, action, containers);

    await cleanChildren(action, container)
}

async function getStyleValue(container: HTMLElement, action: ExecCommandStyle, containers: string): Promise<string> {
    if (!container) {
        return action.value;
    }

    if (await action.initial(container)) {
        return 'initial';
    }
    const style: Node | null = await findStyleNode(container, action.style, containers);

    if (await action.initial(style as HTMLElement)) {
        return 'initial';
    }

    return action.value;
}

// Recursively iterates till it either find an element with the same
// style or the container
async function findStyleNode(node: Node,
    style: string,
    containers: string): Promise<Node | null> {
    // Just in case
    if (node.nodeName.toUpperCase() === 'HTML' ||
        node.nodeName.toUpperCase() === 'BODY') {
        return null;
    }

    if (!node.parentNode) {
        return null;
    }

    if (isContainer(containers, node)) {
        return null;
    }

    const hasStyle: boolean =
        (node as HTMLElement).style[style] !== null &&
        (node as HTMLElement).style[style] !== undefined &&
        (node as HTMLElement).style[style] !== '';

    if (hasStyle) {
        return node;
    }

    return await findStyleNode(node.parentNode, style, containers);
}


async function cleanChildren(action: ExecCommandStyle,
    span: HTMLSpanElement) {
    if (!span.hasChildNodes()) {
        return;
    }

    // Clean direct (> *) children with same style
    const children: HTMLElement[] =
        Array.from(span.children)
            .filter((element: HTMLElement) => {
                return element.style[action.style] !== undefined &&
                    element.style[action.style] !== '';
            }) as HTMLElement[];

    if (children && children.length > 0) {
        children.forEach((element: HTMLElement) => {
            element.style[action.style] = '';

            if (element.getAttribute('style') === '' ||
                element.style === null) {
                element.removeAttribute('style');
            }
        });
    }

    // Direct children (> *) may have children (*) to be clean too
    const cleanChildrenChildren: Promise<void>[] =
        Array.from(span.children).map((element: HTMLElement) => {
            return cleanChildren(action, element);
        });

    if (!cleanChildrenChildren || cleanChildrenChildren.length <= 0) {
        return;
    }

    await Promise.all(cleanChildrenChildren);
}


function isContainer(containers: string, element: Node): boolean {
    const containerTypes: string[] = containers.toLowerCase().split(',');
    return element && element.nodeName && containerTypes.indexOf(element.nodeName.toLowerCase()) > -1;
}

async function replaceSelection(container: HTMLElement,
    action: ExecCommandStyle,
    selection: Selection,
    containers: string) {
    const range: Range = selection.getRangeAt(0);

    const fragment: DocumentFragment = range.extractContents();

    const span: HTMLSpanElement =
        await createSpan(container, action, containers);
    span.appendChild(fragment);

    await cleanChildren(action, span);
    await flattenChildren(action, span);

    range.insertNode(span);
    selection.selectAllChildren(span);
}

async function createSpan(container: HTMLElement,
    action: ExecCommandStyle,
    containers: string): Promise<HTMLSpanElement> {
    const span: HTMLSpanElement = document.createElement('span');
    span.style[action.style] =
        await getStyleValue(container, action, containers);

    return span;
}

async function flattenChildren(action: ExecCommandStyle,
    span: HTMLSpanElement) {
    if (!span.hasChildNodes()) {
        return;
    }

    // Flatten direct (> *) children with no style
    const children: HTMLElement[] =
        Array.from(span.children).filter((element: HTMLElement) => {
            const style: string | null = element.getAttribute('style');
            return !style || style === '';
        }) as HTMLElement[];

    if (children && children.length > 0) {
        children.forEach((element: HTMLElement) => {
            const styledChildren: NodeListOf<HTMLElement> =
                element.querySelectorAll('[style]');
            if (!styledChildren || styledChildren.length === 0) {
                const text: Text =
                    document.createTextNode(element.textContent);
                element.parentElement.replaceChild(text, element);
            }
        });

        return;
    }

    // Direct children (> *) may have children (*) to flatten too
    const flattenChildrenChildren: Promise<void>[] =
        Array.from(span.children).map((element: HTMLElement) => {
            return flattenChildren(action, element);
        });

    if (!flattenChildrenChildren ||
        flattenChildrenChildren.length <= 0) {
        return;
    }

    await Promise.all(flattenChildrenChildren);
}