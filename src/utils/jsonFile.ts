import * as fs from 'fs';
import * as path from 'path';

const jsonSerialize = object => JSON.stringify(object, null, 2);
const jsonDeserialize = string => JSON.parse(string);


export class Json {
    private filepath: string
    constructor(filepath: string) {
        this.filepath = path.resolve(filepath)
    }

    public read() {
        let json: string|any = '{}';
        try {
            json = fs.readFileSync(this.filepath, 'utf8');
        } catch {}
        return jsonDeserialize(json)
    }

    public save(object: object) {
        fs.writeFileSync(this.filepath, jsonSerialize(object))
    }
}
