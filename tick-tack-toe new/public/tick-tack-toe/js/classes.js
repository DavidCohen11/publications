/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

class Coord{
    col;
    line;
    constructor(col,line){
        this.col=col;
        this.line=line;
    } 
}

class Mouve{
    col;
    line;
    constructor(col,line){
        this.col=col;
        this.line=line;
    } 
}

class Game{
    over;
    turn;
    round;
    players;
    winner;
    first;
    nbrSeq;
    over;
    points;
    constructor() {
        this.over=false;
        this.playersNames=["X","O"];
        this.players=new Map();
        this.players.set("X",new PlayerX("X"));
        this.players.set("O",new PlayerO("O"));
        this.first=this.players.get(this.playersNames[Math.floor(Math.random() * 2)]).name;
        this.turn=this.first;
        this.round=0;
        this.over=false;
        this.winner="none";
        this.points=0;    
    } 
    
}

class Player{
    name;
    done;
    first_turn; 
    play(){
    }
    message(){

    }
    constructor(name) {
        this.name=name;
        this.done=false;
        this.first_turn=true;
    } 
}



class PlayerX extends Player{
    play(){
        
    }
    message(){
        return "I Wan!!!";
    }
    constructor(name) {
        super(name);
    } 
}

class PlayerO extends Player{
    play(){
        
    }
    message(){
        return "You Wan!!!";
    }
    constructor(name) {
        super(name);
    } 
}

class PathItem{
    col;
    line;
    item;
    constructor(col,line,item){
        this.col=col;
        this.line=line;
        this.item=item;
    }
}