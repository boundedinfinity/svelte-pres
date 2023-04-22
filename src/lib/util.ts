interface Options {
    name?: string;
    space?: number;
}
export function dumps(obj: any, options?: Options): string {
    let str: string = "";

    if (options?.name) {
        str = `${options.name} `;
    }

    str += JSON.stringify(obj, replacerFunc(), options?.space || 0);

    return str;
}

export function dumpl(obj: any, options?: Options) {
    console.log(dumps(obj, options));
}

// https://careerkarma.com/blog/converting-circular-structure-to-json/
const replacerFunc = () => {
    const visited = new WeakSet();
    return (key: any, value: any) => {
        if (typeof value === "object" && value !== null) {
            if (visited.has(value)) {
                return;
            }
            visited.add(value);
        }
        return value;
    };
};

export {};
