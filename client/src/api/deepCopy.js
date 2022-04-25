export default function deepCopy(x){
    return JSON.parse(JSON.stringify(x))
}