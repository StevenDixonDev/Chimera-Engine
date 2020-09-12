interface imageData {
    tiles?: {
        width: number,
        height: number,
        sheet: string,
        mapAlias: {
            [key: number]: number[]
        }
    },
    sprites?: {
        width: number,
        height: number,
        sheet: string,
        animationKeys: {
            row: number,
            column: number,
            alength: number
        }
    }
}


class ImageManager {
    ready: boolean;
    images: object;
    imageCollection: object;
    imageSrc: object;
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    scale: number;
    imageData: imageData;

    constructor(){
        this.ready = false;
        this.images = {};
        this.imageSrc = {};
        this.ctx = null;
        this.canvas = null;
        this.scale = 1;
        this.imageData = {}
    }
    setup(ctx, canvas, scale: number) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.scale = scale;
    }
    addImages(images: object, imageData: object){
        this.imageSrc = images;
        this.imageData = imageData;
    }
    async loadImages() :Promise<boolean>{
        let p = [];

        for(const ikey in this.imageSrc){
            this.images[ikey] = new Image();

            let promise = new Promise((resolve, reject) => {
                this.images[ikey].addEventListener('load', () => {
                    resolve({ikey: this.images[ikey]});
                })
            })

            p.push(promise);

            this.images[ikey].src = this.imageSrc[ikey];
        }

        return Promise.all(p).then(v => {return true})
    }
    drawTile(tile: string, x: number, y: number) {
        if(this.imageData['tiles']){
            let target = {x: 0, y: 0}
            let width = this.imageData.tiles.width;
            let height = this.imageData.tiles.height;
            let image = this.images[this.imageData.tiles.sheet];
            target.x = this.imageData.tiles.mapAlias[tile][0] * width;
            target.y = this.imageData.tiles.mapAlias[tile][1] * height;
            this.ctx.drawImage(image, target.x, target.y, width, height, x, y, width, height);
        }
    }
    drawSprite(sprite: string, state: number, x: number, y: number, rotation?: number){
        let target = {x: 0, y: 0}
        let width = this.imageData.sprites[sprite].width;
        let height = this.imageData.sprites[sprite].height;

        let image = this.images[this.imageData.sprites[sprite].sheet];

        target.x = this.imageData.sprites[sprite].animationKeys[state].row * width;
        target.y = this.imageData.sprites[sprite].animationKeys[state].column * height;
        //check if rotation is null
        if (rotation ! === 0 || rotation == null){
            this.ctx.drawImage(image, target.x, target.y, width, height, x, y, width, height);
        }else {
            
            // move to center of image
            this.ctx.translate(x + width/2, y + height/2);

            // rotate by specific degree
            this.ctx.rotate(rotation * Math.PI / 180 );
            // this.ctx.strokeStyle = "red";
            // this.ctx.beginPath();
            // this.ctx.rect(0, 0, 100, 100);
            // this.ctx.stroke();
            

            

            this.ctx.drawImage(image, target.x, target.y, width, height, 0 - width/2, 0 - height/2, width, height);

            // rotate back
            this.ctx.rotate(-rotation * Math.PI / 180);
            // move back to regular offst
            this.ctx.translate(-x - width/2 , -y -  height/2);
           
        }
    }
    drawBG(image: string, rotation: number){
        this.ctx.save();

        this.ctx.restore();
    };
    drawText(text: string, x: number, y: number){
        this.ctx.fillText(text, x, y);
    }
}

export default ImageManager