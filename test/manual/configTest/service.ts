import "../../../src";


class DemoService<R = any> extends PetalBaseService<R>{

    @petalMethodDecorator({
        url: "/"
    })
    static async getIndex(): Promise<string> {
        return this.res.data;
    }

}

export default DemoService
