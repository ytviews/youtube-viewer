import * as fs from 'fs';
import * as path from 'path';
import JSON from '@httpie/json';


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
        return JSON.parse(json)
    }

    public save(object: object) {
        fs.writeFileSync(this.filepath, JSON.stringify(object, undefined, 2))
    }
}
