import _ from 'lodash'

interface Options {
    prefix?: string
    method?: string
    name?: string;
    space?: number;
}

export function dumps(obj: any, options?: Options): string {
    let str: string = "";

    if (options?.prefix) {
        str = `${options.prefix}.`;
    }

    if(options?.method) {
        str = `${options.method}.`;
    }

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

class Dumper {
    options?: Options
    constructor(options?: Options) { this.options = options }

    private combine(options?: Options): Options {
        return Object.assign({}, ..._.compact([this.options, options]))
    }

    info(obj: any, options?: Options) {
        console.info(dumps(obj, this.combine(options)))
    }

    warn(obj: any, options?: Options) {
        console.warn(dumps(obj, this.combine(options)))
    }

    debug(obj: any, options?: Options) {
        console.debug(dumps(obj, this.combine(options)))
    }

    error(obj: any, options?: Options) {
        console.error(dumps(obj, this.combine(options)))
    }
}

const dumper = new Dumper()

export {
    dumper,
    Dumper
};
