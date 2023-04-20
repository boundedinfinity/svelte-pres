import {} from "flatted";

export function dump(obj: any, options?: { name?: string }) {
    let str: string = "";

    if (options?.name) {
        str = `${options.name} `;
    }

    str += JSON.stringify(obj, replacerFunc(), " ".repeat(4));

    console.log(str);
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
