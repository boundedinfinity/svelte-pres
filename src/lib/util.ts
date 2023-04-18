export function dump(obj:any, options?: {name?:string}) {
    let str: string = ""

    if (options?.name) {
        str = `${options.name} `
    }

    str += JSON.stringify(obj, null, "    ")
    
    console.log(str)
}
