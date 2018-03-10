function check_same_parameter(parameter){
    return this.hasOwnProperty("isValidValue") && this.isValidValue(parameter)
}
function check_same_parameters(...parameters){
    return parameters.map(parameter=>check_same_parameter.call(this, parameter)).length == this.length
}

// Add + update to enable overloading
class Mapper {
    constructor(){
        this.map = []
    }
    add(function_declaration) {
        if (this.map[function_declaration.function_name] == null) {
            this.map[function_declaration.function_name] = [function_declaration]
        } else 
            this.map[function_declaration.function_name].push(function_declaration)
    }
    remove(function_declaration) {
        if (!!this.map[function_declaration.function_name]) {
            let a = this.map[function_declaration.function_name]
            let b = a.map((fn, index)=>{
                let c = fn.parameters.map((parameter, index) => {
                    if (!check_same_parameter.call(function_declaration.parameters[index], parameter))
                        return null
                }).filter(e=>!!e)
                return c.length == fn.parameters.length
            })
            let counter = 0
            b.foreach(e=>{
                this.map[function_declaration.function_name].splice(e - counter++, 1)
            })
        }
    }
    update(function_declaration) {
        if (1) {}
    }
    execute(function_name, ...parameters){
        let fn = this.map[function_name].filter(fn=>check_same_parameters.apply(fn.parameters, parameters))

        // Does it make sense to execute more than one?
        if (fn.length == 1)
            return fn[0].code.apply(null, parameters)
    }
}

class Function {
    constructor(function_name, code, parameters=new Array(), in_type="void", out_type="void") {
        this.function_name = function_name
        this.code = code
        this.in_type = in_type
        this.out_type = out_type
        this.parameters = parameters
    }
    add_parameter(...parameters){

    }
    remove_parameter(...parameters){

    }
    remove_all_parameters(){
        this.parameters = this.parameters.map(e=>null).filter(e=>e!=null)
    }
    update_code(code){
        this.code = code
    }
}

class Parameter {
    constructor(type, name, checkFn=e=>1, default_value=null, visibility="public") {
        this.type = type
        this.name = name
        this.checkFn = checkFn
        this.visibility = visibility
        this.default_value = null
    }
    isValidValue(value){
        return this.checkFn.call(value)
    }
}