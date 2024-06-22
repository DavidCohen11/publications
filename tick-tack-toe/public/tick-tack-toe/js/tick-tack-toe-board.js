
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$( function() {
    
    $.widget( "tick-tack-toe.ttt_board", {
         options: {
            width:0,
            height:0,
            nbrSeq:0
        },
 
        // The constructor
        _create: function() {
            let self=this;
            this.valid=false;
            this.id=$(this.element).attr("id");
            this.width=this.options.width;
            this.height=this.options.height;
            this.nbrSeq=this.options.nbrSeq;
            this.element.addClass("tick-tack-toe.ttt_board");
            this.board=new Map();
            this.game=new Game();
            $("#"+this.id).width(this.width);
            $("#"+this.id).height(this.height);
            this.elemWidth=Math.round($("#"+this.id).width()/this.nbrSeq,2);
            this.elemHeight=Math.round($("#"+this.id).height()/this.nbrSeq,2);
            this.build();
            
            //this.init();
            this.play();
            this._refresh();
        },
       build: function(){
            let self=this;
            let html="";
            for(let line=0;line<self.nbrSeq; line++){
                for(let col=0;col<self.nbrSeq; col++){
                    html+="<div id=\"elem_"+col+"_"+line+"\" style=\""+"width:"+self.elemWidth+"px;"+"height:"+self.elemHeight+"px\" class=\"element\"></div>";
                }
            }
            $("#"+self.id).html(html);
            for(let line=0;line<self.nbrSeq; line++){
                for(let col=0;col<self.nbrSeq; col++){
                    $("#elem_"+col+"_"+line).ttt_element();
                    self.board.set("elem_"+col+"_"+line,"");
                }
            }
        },
        play: function(){
            let self=this;
            if(!self.game.over){
                if(self.game.turn==="X"){
                    self.playX();
                    self.game.turn==="O";
                }else{
                    self.playO(); 
                }
            }else{
                if(self.game.winner==="X"){
                    $("#turn").html(self.game.players.get("X").message());
                }else if(self.game.winner==="O"){
                    $("#turn").html(self.game.players.get("O").message());
                }else{
                    $("#turn").html("It's a Tie!!!");
                }
            }    
        },
        playX: function(){
            let self=this;
            $("#turn").html("My Turn!!!");
            setTimeout(function(){
                if(self.game.turn==="X"){
                    if(!self.game.over){
                        self.board=self.buildBoard();
                        let temp=self.board;
                        let minMouve=new Mouve(-1,-1);
                        if((self.game.players.get("X").first_turn)&&(self.nbrSeq>3)){
                            let value="";
                            let possibleMouves=[];
                            for(col=0;col<self.nbrSeq;col++){
                                for(line=0;line<self.nbrSeq;line++){
                                    if(Math.abs(col-line)===2){
                                        possibleMouves.push(new Mouve(col,line));
                                    }
                                }
                            }
                            let mv=new Mouve(-1,-1);
                            do{
                                mv=possibleMouves[Math.floor(Math.random()*possibleMouves.length)];
                                value=$("#elem_"+mv.col+"_"+mv.line).ttt_element("getValue");
                            }while((value==="X")||(value==="O"))   
                            minMouve.col=mv.col;
                            minMouve.line=mv.line;    
                        }else{
                            minMouve=self.findBestMouve(temp); 
                        } 
                        self.board.set("elem_"+minMouve.col+"_"+minMouve.line,"X");
                        $("#elem_"+minMouve.col+"_"+minMouve.line).ttt_element("setValue","X");
                        $("#elem_"+minMouve.col+"_"+minMouve.line).ttt_element("build");
                        if(self.game.first!=="X"){
                            self.game.round++;
                        }
                        $("#elem_"+minMouve.col+"_"+minMouve.line).ttt_element("setEditable",false);
                        self.game.players.get("X").done=true;
                        self.game.players.get("O").done=false;  
                        self.game.players.get("X").first_turn=false;
                        self.game.turn="O";
                        
                        self.evaluate(self.board);

                    }    
                } 
                self.play();
            },2000);
        },
              
        init: function(){
            let self=this;
            for(let col=0;col<self.nbrSeq;col++){
                for(let line=0;line<self.nbrSeq;line++){
                    if(col+line===6){
                        self.board.set("elem_"+col+"_"+line,"O");
                        $("#elem_"+col+"_"+line).ttt_element("setValue","O");
                        $("#elem_"+col+"_"+line).ttt_element("build");
                    }
                    if(line-col===2){
                        self.board.set("elem_"+col+"_"+line,"O");
                        $("#elem_"+col+"_"+line).ttt_element("setValue","O");
                        $("#elem_"+col+"_"+line).ttt_element("build");
                    }  
                    if(col-line===2){
                        self.board.set("elem_"+col+"_"+line,"O");
                        $("#elem_"+col+"_"+line).ttt_element("setValue","O");
                        $("#elem_"+col+"_"+line).ttt_element("build");
                    }
                    if(col+line===2){
                        self.board.set("elem_"+col+"_"+line,"O");
                        $("#elem_"+col+"_"+line).ttt_element("setValue","O");
                        $("#elem_"+col+"_"+line).ttt_element("build");
                    }    
                    if(col-line===1){
                        self.board.set("elem_"+col+"_"+line,"X");
                        $("#elem_"+col+"_"+line).ttt_element("setValue","X");
                        $("#elem_"+col+"_"+line).ttt_element("build");
                    }   
                    if(col+line===3){
                        self.board.set("elem_"+col+"_"+line,"X");
                        $("#elem_"+col+"_"+line).ttt_element("setValue","X");
                        $("#elem_"+col+"_"+line).ttt_element("build");
                    }  
                    if(line-col===1){
                        self.board.set("elem_"+col+"_"+line,"X");
                        $("#elem_"+col+"_"+line).ttt_element("setValue","X");
                        $("#elem_"+col+"_"+line).ttt_element("build");
                    }   
                    if(col+line===5){
                        self.board.set("elem_"+col+"_"+line,"X");
                        $("#elem_"+col+"_"+line).ttt_element("setValue","X");
                        $("#elem_"+col+"_"+line).ttt_element("build");
                    } 
                }
            }    
            
        },

        playO: function(){
            let self=this;
             $("#turn").html("Your Turn!!!");
            setTimeout(function(){
                if(self.game.first!=="O"){
                    self.game.round++;
                }
                self.play();
            },5000);  
        },
        
        playRandom: function(){
            let self=this;
            let mouves=[];
            for(let col=1;col<self.nbrSeq-1;col++){
                for(let line=1;line<self.nbrSeq-1;line++){
                    mouves.push(new Mouve(col,line));
                }
            }
            return mouves[Math.floor(Math.random()*mouves.length)];        
        },

        findBestMouve: function(board) {
            let self=this;
            let bestMove = 0;
            let bestScore = Infinity;
            let mouves=self.possibleMouves(board);
            for(let mv in mouves){
                self.setBoard(board,mouves[mv],"X");
                let score=self.evaluate(board);
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = mouves[mv];
                }
                self.setBoard(board,mouves[mv],"");
            }

            return bestMove;
        },
  
        possibleMouves:function(board){
            let self=this;
            let mouves=[];
            for(let col=0;col<self.nbrSeq;col++){
                for(let line=0;line<self.nbrSeq;line++){
                    let value=board.get("elem_"+col+"_"+line);
                    if(value===""){
                        let mouve=new Mouve(col,line);
                        mouves.push(mouve);
                    }
                }
            }
            return mouves;
        },
        
        setBoard(board,mouve,value){
            board.set("elem_"+mouve.col+"_"+mouve.line,value);
        },


        buildBoard: function(){
            let self=this;
            let result=new Map();
            for(let col=0;col<self.nbrSeq;col++){
                for(let line=0;line<self.nbrSeq;line++){
                    let value=$("#elem_"+col+"_"+line).ttt_element("getValue");
                    result.set("elem_"+col+"_"+line,value);
                }
            }  
            return result; 
        },
        pathSum: function(path){
            let result="";
            for(let ch in path){
                result+=path[ch];
            }
            return result;
        },

        filled: function(board){
            let self=this;
            let result=true;
            for(let col=0;col<self.nbrSeq;col++){
                for(let line=0;line<self.nbrSeq;line++){
                    let item=board.get("elem_"+col+"_"+line);
                    if(item===""){
                        result=false;        
                    }
                }
            }        
            return result;
        },

        buildConsoleBoard: function(boardData){
            let self=this;
            let result="";
            for(let line=0;line<self.nbrSeq;line++){
                let l="|";
                for(let col=0;col<self.nbrSeq;col++){
                    let value=boardData.get("elem_"+col+"_"+line);
                    value= value==="" ?  " " : value;
                    l+=value+"|";
                }
                l+="\n";
                result+=l;
            }
            return result;            
        },

        showBoard: function(board){
            let self=this;
            console.log(self.buildConsoleBoard(board));
        },



        buildBoard: function(){
            let self=this;
            let result=new Map();
            for(let col=0;col<self.nbrSeq;col++){
                for(let line=0;line<self.nbrSeq;line++){
                    let value=$("#elem_"+col+"_"+line).ttt_element("getValue");
                    result.set("elem_"+col+"_"+line,value);
                }
            }  
            return result; 
        },

        evaluate: function(board){
            let self=this;
            let paths=[];
            let value="";
            let points=0;
            for(let col=0;col<self.nbrSeq;col++){
                value="";
                for(let line=0;line<self.nbrSeq;line++){
                    let item=board.get("elem_"+col+"_"+line);
                    value+=(item==="" ? "#" : item);
                }
                paths.push(value);
                value="";
            }
            value="";
            for(let line=0;line<self.nbrSeq;line++){
                value="";
                for(let col=0;col<self.nbrSeq;col++){
                    let item=board.get("elem_"+col+"_"+line);
                    value+=(item==="" ? "#" : item);
                }
                paths.push(value);
                value="";
            }
            value="";
            for(let col=0;col<self.nbrSeq;col++){
                for(let line=0;line<self.nbrSeq;line++){
                    if(col===line){
                        let item=board.get("elem_"+col+"_"+line);
                        value+=(item==="" ? "#" : item);
                    }           
                }
                
            }
            paths.push(value);
            value="";
            for(let col=0;col<self.nbrSeq;col++){
                for(let line=0;line<self.nbrSeq;line++){
                    if(col+line===self.nbrSeq-1){
                        let item=board.get("elem_"+col+"_"+line);
                        value+=(item==="" ? "#" : item);
                    }    
                }
            }
            paths.push(value);
            if(self.nbrSeq==="5"){
                value="";
                for(let col=0;col<self.nbrSeq;col++){
                    for(let line=0;line<self.nbrSeq;line++){
                        if(col+line===6){
                            let item=board.get("elem_"+col+"_"+line);
                            value+=(item==="" ? "#" : item);
                        }
                    }
                }
                paths.push(value);   
                value="";
                for(let col=0;col<self.nbrSeq;col++){
                    for(let line=0;line<self.nbrSeq;line++){
                        if(line-col===2){
                            let item=board.get("elem_"+col+"_"+line);
                            value+=(item==="" ? "#" : item);
                        }
                    }
                } 
                paths.push(value); 
                value="";
                for(let col=0;col<self.nbrSeq;col++){
                    for(let line=0;line<self.nbrSeq;line++){
                        if(col-line===2){
                            let item=board.get("elem_"+col+"_"+line);
                            value+=(item==="" ? "#" : item);
                        }
                    }
                }
                paths.push(value);              
                value="";
                for(let col=0;col<self.nbrSeq;col++){
                    for(let line=0;line<self.nbrSeq;line++){
                        if(col+line===2){
                            let item=board.get("elem_"+col+"_"+line);
                            value+=(item==="" ? "#" : item);
                        }
                    }
                }   
                paths.push(value);    
                value="";
                for(let col=0;col<self.nbrSeq;col++){
                    for(let line=0;line<self.nbrSeq;line++){
                        if(col-line===1){
                            let item=board.get("elem_"+col+"_"+line);
                            value+=(item==="" ? "#" : item);
                        }
                    }
                } 
                paths.push(value);           
                value="";
                for(let col=0;col<self.nbrSeq;col++){
                    for(let line=0;line<self.nbrSeq;line++){
                        if(col+line===3){
                            let item=board.get("elem_"+col+"_"+line);
                            value+=(item==="" ? "#" : item);
                        }
                    }
                } 
                paths.push(value);
                value="";
                for(let col=0;col<self.nbrSeq;col++){
                    for(let line=0;line<self.nbrSeq;line++){
                        if(line-col===1){
                            let item=board.get("elem_"+col+"_"+line);
                            value+=(item==="" ? "#" : item);
                        }
                    }
                }
                paths.push(value);
                value="";                
                for(let col=0;col<self.nbrSeq;col++){
                    for(let line=0;line<self.nbrSeq;line++){
                    if(col+line===5){
                            let item=board.get("elem_"+col+"_"+line);
                            value+=(item==="" ? "#" : item);
                        }
                    }
                }   
                paths.push(value);
            }    
            points=0;
            let patterns=[];
            let bonusPath3=self.nbrSeq-2;
            let bonusPath4=self.nbrSeq-3;
            let bonusPath5=self.nbrSeq-4;
            for(let path in paths){
                console.log(paths[path]);
                patterns=["XXXXX"];
                if(patterns.includes(paths[path])){
                    self.game.over=true;
                    self.game.winner="X";
                    points+=-1000;
                    break;
                }
                patterns=["OOOOO"];
                if(patterns.includes(paths[path])){
                    self.game.over=true;
                    self.game.winner="O";
                    points+=1000;
                    break;
                }   
                patterns=["XXXX"];
                if(patterns.includes(paths[path])){
                    self.game.over=true;
                    self.game.winner="X";
                    points+=-1000;
                    break;
                }
                patterns=["OOOO"];
                if(patterns.includes(paths[path])){
                    self.game.over=true;
                    self.game.winner="O";
                    points+=1000;
                    break;
                }  
                    
                patterns=["XXX"];
                if(patterns.includes(paths[path])){
                    self.game.over=true;
                    self.game.winner="X";
                    points+=-1000;
                    break;
                }
                patterns=["OOO"];
                if(patterns.includes(paths[path])){
                    self.game.over=true;
                    self.game.winner="O";
                    points+=1000;
                    break;
                }

                patterns=["OXO"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-150*bonusPath3;
                    
                }

                patterns=["OOX","XOO"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-150*bonusPath3;
                    
                }   

                patterns=["#OX","XO#","OX#","#XO","X#O","O#X"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-30*bonusPath3;
                    
                }

                patterns=["X#X"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-50*bonusPath3;
                    
                }

                patterns=["XX#","#XX"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-40*bonusPath3;
                    
                }

                patterns=["##X","X##","#X#"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-30*bonusPath3;
                    
                }
          
                patterns=["#XOO","OOX#","X#OO","OO#X"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-150*bonusPath4;
                    
                }
                          
                patterns=["XOOO","OOOX"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-150*bonusPath4;
                    
                } 

                patterns=["X#XX","XX#X"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-50*bonusPath4;
                    
                }

                patterns=["XXX#","#XXX"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-40*bonusPath4;
                    
                }

                patterns=["OOOOX","XOOOO","OOO#X","X#OOO","OOOX#","#XOOO"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-150*bonusPath5;
                    
                }   
                
                
                patterns=["#OXO#","#OX##","##XO#"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-120*bonusPath5;
                    
                }
                patterns=["#OOX#","#XOO#"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-100*bonusPath5;
                    
                }

                patterns=["#OX#O","O#XO#","OXO#O","O#OXO"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-90*bonusPath5;
                    
                }   
    
                patterns=["##XOO","OOX##","X###O","O###X"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-80*bonusPath5;
                    
                }
                
                patterns=["#XXX#"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-60*bonusPath5;
                    
                }

                patterns=["X###X"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-100*bonusPath5;
                    
                } 

                patterns=["#X#X#"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-50*bonusPath5;
                    
                }

                patterns=["#XX##","##XX#"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-40*bonusPath5;
                    
                }

                patterns=["##X##"];
                if(patterns.includes(paths[path])){
                    self.game.over=false;
                    points+=-30*bonusPath5;
                    
                }           
                
                
            
            }
           if(self.filled(board)){
                self.game.over=true;
            }else{
                if(self.game.winner==="none"){
                    self.game.over=false;
                }    
            }
            self.showBoard(board);
            console.log(points);
            return points;
        },


        getTurn: function(){
            let self=this;
            return self.game.turn;
        },
        
        setTurn: function(turn){
            let self=this;
            self.game.turn=turn;
        },
        
        getXDone: function(){
             let self=this;
             return self.game.players.get("X").done;
        },
        
        setXDone: function(value){
             let self=this;
             self.game.players.get("X").done=value;
        },
        
        getODone: function(){
             let self=this;
             return self.game.players.get("O").done;
        },
        
        setODone: function(value){
             let self=this;
             self.game.players.get("O").done=value;
        },
        
        // Called when created, and later when changing options
        _refresh: function() {
        },

        // Events bound via _on are removed automatically
        // revert other modifications here
        _destroy: function() {
            // remove generated elements
            this.element.removeClass( "tick-tack-toe.ttt_board" );
            $(this).empty();
        },

        // _setOptions is called with a hash of all options that are changing
        // always refresh when changing options
        _setOptions: function() {
            // _super and _superApply handle keeping the right this-context
            this._superApply( arguments );
            this._refresh();
        },

        // _setOption is called for each individual option that is changing
        _setOption: function( key, value ) {
            // prevent invalid color values
            this._super( key, value );
        }
    });
});
