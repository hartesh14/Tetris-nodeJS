

const canvas = document.getElementById('tetris');
const context= canvas.getContext('2d');
context.scale(20,20);



function arenasweep(){
    let RowCount=1;

    outer: for(let y=arena.length-1;y>0 ;--y)
    {
        for(let x=0;x<arena[y].length; ++x)
        {

            if (arena[y][x]===0){

                continue outer ;

            }

        }
        const row =arena.splice(y,1)[0].fill(0); //value of y obtained from loop of length 1 and starting from index 0 will be filled with zeros and saved in row .
        arena.unshift(row); // the new row obtained with zeros will be shifted to first row
        ++y; //to increase the value of y ,,to check again for same row,,it checks incase 2 or more rows get filled up
        player.score+=RowCount*100;
        RowCount*=2;
    }

}





function createpiece(type)
{
    if(type==='T')
    {return[
        [0,0,0],
        [1,1,1],
        [0,1,0],
    ];
    }
    else if(type==='O')
    {
        return[

            [2,2],
            [2,2],
        ];
    }
    else if(type==='L')
    {
        return[
            [0,3,0],
            [0,3,0],
            [0,3,3],
        ];
    }
    else if(type==='J')
    {
        return[
            [0,4,0],
            [0,4,0],
            [4,4,0],
        ];
    }

    else if(type==='I')
    {
        return[
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
            [0,5,0,0],
        ];
    }
    else if(type==='S')
    {
        return[
            [0,6,6],
            [6,6,0],
            [0,0,0],
        ];
    }

    else if(type==='Z')
    {
        return[
            [7,7,0],
            [0,7,7],
            [0,0,0],
        ];
    }


}






const arenaCols = 12;
const arenaRows = 20;
const arena = createMatrix(arenaCols, arenaRows);

const collide = (arena, player) => {
    const [m, o] = [player.matrix, player.pos];
    for(let y=0; y<m.length; ++y){
        for(let x=0; x<m[y].length; ++x){
            const outOfBounds = y+o.y >= 20 || x+o.x >= 12;
            if(m[y][x] === 0){
                continue;
            }
            else if(outOfBounds || arena[y+o.y][x+o.x] !== 0){
                return true;
            }
            else {
                continue;
            }
        }
    }
    return false;
};






const colors=[null,'red','blue','violet','green','purple','orange','pink',];
const player= {
    pos:{x:0,y:0},
    matrix:null,
    score:0,
}





function createMatrix(w,h){
    const matrix =[];
    while(h--){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}




function draw(){
    context.fillStyle= '#000';
    context.fillRect(0,0,canvas.height,canvas.width);

    drawmatrix(player.matrix,player.pos);
    drawmatrix(arena,{x:0,y:0});

}




function drawmatrix(matrix,offset) {
    matrix.forEach((row,y) => {
        row.forEach((value,x)=>{
            if (value !==0){
                context.fillStyle=colors[value];
                context.fillRect(x+offset.x,
                    y+offset.y,
                    1,1);
            }
        });
    });
}




function merge (arena,player)
{
    player.matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if (value!==0){
                arena[y+player.pos.y][x+player.pos.x]=value;
            }

        });
    });
}



function PlayerDrop(){
    player.pos.y++;
    if(collide(arena,player)){
        player.pos.y--;
        merge(arena,player);
        PlayerReset();
        arenasweep();
        updatescore();
    }
    dropcounter=0;         //to manage the speed ,otherwise speed doubles

}



function PlayerReset(){
    const pieces ='ILJOTSZ';
    player.matrix= createpiece(pieces[pieces.length*Math.random() |0]);
    player.pos.y=0;
    player.pos.x=(arena[0].length/2 |0) - (player.matrix[0].length/2 |0) ;
    if (collide(arena,player)){
        arena.forEach(row => row.fill(0));      //to restart game otherwise screen does not get empty
        player.score=0;
        updatescore();
    }
}





function Playermove(dir){

    player.pos.x+=dir;
    if(collide(arena,player)){
        player.pos.x-=dir;
    }
}

function playerrotate(dir){
    const pos=player.pos.x;
    let offset=1;
    rotate(player.matrix,dir);             //To call for rotation
    while(collide(arena,player))           //to avoid collision while rotating
    {player.pos.x+=offset;
        offset=-(offset + (offset>0 ? 1:-1));
        if (offset>player.matrix[0].length)
        {
            rotate(player.matrix ,dir);
            player.pos.x=pos;
            return;
        }
    }

}

function rotate(matrix,dir){
    for (let y=0;y<matrix.length;++y)
    {
        for (let x=0; x<y; ++x){
            [matrix[x][y] , matrix[y][x],]=[matrix[y][x] ,matrix[x][y],];
        }
    }
    if(dir>0){
        matrix.forEach(row =>row.reverse());
    }
    else {matrix.reverse();
    }
}


let dropcounter=0;
let dropinterval=1000;
let lastTime=0;
function update(time=0)
{
    const deltaTime=time-lastTime;
    lastTime=time;
    dropcounter+=deltaTime;
    if(dropcounter>dropinterval){
        PlayerDrop();
    }
    draw(); //after 16ms agin draw the canvas
    requestAnimationFrame(update); //after 16 ms means 60fps again call update function
}

function updatescore(){
    document.getElementById('Score').innerText=player.score;
}




document.addEventListener('keydown',event =>{
    if(event.keyCode===37){
        Playermove(-1);     //console.log(event);
    }
    else if(event.keyCode===39){
        Playermove(1);
    }
    else if(event.keyCode===40){
        PlayerDrop();
    }
    else if(event.keyCode===81){  //q=81 ,w=87
        playerrotate(-1);

    }
    else if(event.keyCode===87){
        playerrotate(1);

    }
});

PlayerReset();
updatescore();
update();





