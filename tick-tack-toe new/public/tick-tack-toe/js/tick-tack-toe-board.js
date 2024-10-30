
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$( function() {
    
    $.widget( "tick-tack-toe.ttt_board", {
         options: {
            nbrSeq:0
        },
 
        // The constructor
        _create: function() {
            let self=this;
            this.valid=false;
            this.id=$(this.element).attr("id");
            this.width=this.options.width;
            this.height=this.options.height;
            this.nbrSeq=parseInt(this.options.nbrSeq);
            this.element.addClass("tick-tack-toe.ttt_board");
            this.board=new Map();
            this.game=new Game();
            this.paths=[];
            this.winnerPath=[];
            this.elemWidth=100/this.nbrSeq;
            this.elemHeight=100/this.nbrSeq;
            this.editable=(self.game.first==="O" ? true : false);
            this.game.turn=(self.game.first==="O" ? "O" : "X");
            this.build();
            //this.init(); 
            self.loop();
            this._refresh();
        },
        
        build: function(){
            let self=this;
            let html="";
            let color="normal";
            for(let line=0;line<self.nbrSeq; line++){
                for(let col=0;col<self.nbrSeq; col++){
                    html+="<div id=\"elem_"+col+"_"+line+"\" class=\"element element-color-"+color+"\" style=\"width:"+self.elemWidth+"% ;height: "+self.elemHeight+"%\"></div>";
                }
            }
            $("#"+self.id).html(html);
            for(let line=0;line<self.nbrSeq; line++){
                for(let col=0;col<self.nbrSeq; col++){
                    $("#elem_"+col+"_"+line).ttt_element({"col":col,"line":line});
                    self.board.set("elem_"+col+"_"+line,"");
                }
            }
        },

        loop: function(){
            let self=this;
            var timeout = 3000;
            var action = function() {
                self.play();
            };
            setInterval(action, timeout);
        },

        play: function(){
            let self=this;
            if(self.game.over===true){
                self.editable=false;
                if(self.game.winner==="X"){
                    $("#turn").html(self.game.players.get("X").message());
                    self.hightlighPath(self.winnerPath,"lightcoral");
                }else if(self.game.winner==="O"){
                    $("#turn").html(self.game.players.get("O").message());
                    self.hightlighPath(self.winnerPath,"lightblue");
                }else{
                    $("#turn").html("It's a Tie!!!");
                }
            }else{
                if(self.game.turn==="X"){
                    self.playX();
                    self.game.turn==="O";
                }else{
                    self.playO(); 
                }  
            }
        },
        playX: function(){
            let self=this;
            self.editable=false;
            $("#turn").html("My Turn!!!");
            var show = function() {
                console.log("delay");
            };
            setInterval(show,1000);
            if(!self.game.over){
                self.board=self.buildBoard();
                minMouve=self.findBestMouve(); 
                self.setBoard(minMouve.col,minMouve.line,"X");
                $("#elem_"+minMouve.col+"_"+minMouve.line).ttt_element("setValue","X");
                $("#elem_"+minMouve.col+"_"+minMouve.line).ttt_element("build","red");    
                self.game.turn="O";
                self.editable=true;
            } 
        },

        playO: function(){
            let self=this;
            $("#turn").html("Your Turn!!!");
            var show = function() {
                console.log("delay"); 
            };
            setInterval(show,1000);
                                                     
        },
          
        setEditable: function(value){
            let self=this;
            self.editable=value;
        },

        getEditable: function(){
            let self=this;
            return self.editable;
        },

        buildConsoleBoard: function(){
            let self=this;
            let result="";
            for(let line=0;line<self.nbrSeq;line++){
                let l="|";
                for(let col=0;col<self.nbrSeq;col++){
                    let value=self.board.get("elem_"+col+"_"+line);
                    value= value==="" ?  " " : value;
                    l+=value+"|";
                }
                l+="\n";
                result+=l;
            }
            return result;            
        },

        findBestMouve: function() {
            let self=this;
            let bestMove = 0;
            let bestScore = Infinity;
            let mouves=self.possibleMouves();
            for(let mv in mouves){
                self.setBoard(mouves[mv].col,mouves[mv].line,"X");
                let score=self.evaluate();
                console.log(self.buildConsoleBoard());
                console.log("SCORE:"+score)
                if (score < bestScore) {
                    bestScore = score;
                    bestMove = mouves[mv];
                }
                self.setBoard(mouves[mv].col,mouves[mv].line,"");
                
                if(self.game.over){
                    break;    
                }
            }
            return bestMove;
        },
  
        possibleMouves:function(){
            let self=this;
            let mouves=[];
            for(let col=0;col<self.nbrSeq;col++){
                for(let line=0;line<self.nbrSeq;line++){
                    let value=self.board.get("elem_"+col+"_"+line);
                    if(value===""){
                        let mouve=new Mouve(col,line);
                        mouves.push(mouve);
                    }
                }
            }
            return mouves;
        },
        
        setBoard: function(col,line,value){
            let self=this;
            self.board.set("elem_"+col+"_"+line,value);
        },

        boardFull: function(){
            let self=this;
            let result=true;
            for(let col=0;col<self.nbrSeq;col++){
                for(let line=0;line<self.nbrSeq;line++){
                    let item=self.board.get("elem_"+col+"_"+line);
                    if(item===""){
                        result=false;        
                    }
                }
            }        
            return result;
        },

        getGameOver: function(){
            let self=this;
            return self.game.over;
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

        hightlightSelectedPaths: function(){
            let self=this;
            self.paths=self.buildPaths();
            let possibleMouves=self.possibleMouves();
            for(let path in self.paths){
                for(let pathItem in self.paths[path]){
                    let col=self.paths[path][pathItem].col;
                    let line=self.paths[path][pathItem].line;
                    $("#elem_"+col+"_"+line).ttt_element("updateBackground","lightgreen");
                }
            }
            for(let mv in possibleMouves){
                let col=possibleMouves[mv].col;
                let line=possibleMouves[mv].line;
                $("#elem_"+col+"_"+line).ttt_element("updateBackground","white");
            }    
        },

        hightlighPath: function(path,background){
            for(let pathItem in path){
                let col=path[pathItem].col;
                let line=path[pathItem].line;
                $("#elem_"+col+"_"+line).ttt_element("updateBackground",background);
            }
        },


        pointerInPath: function(path,col,line){
            let result=false;
            for(let pathItem in path){
                if((path[pathItem].col===col)&&(path[pathItem].line===line)){
                    result=true;
                    break;
                }
            }    
            return result;  
        },

       
        scanPathHorizontal: function(nbrSeq,line){
            let self=this;
            let path=[];
            let pathItem=null;
            for(let col=0;col<nbrSeq;col++){
                let item=self.board.get("elem_"+col+"_"+line);
                pathItem=new PathItem(col,line,(item==="" ? "#" : item));
                path.push(pathItem);
            }
            return path;
        },

        scanPathVertical: function(nbrSeq,col){
            let self=this;
            let path=[];
            let pathItem=null;
            for(let line=0;line<nbrSeq;line++){
                let item=self.board.get("elem_"+col+"_"+line);
                pathItem=new PathItem(col,line,(item==="" ? "#" : item));
                path.push(pathItem);
            }
            return path;
        },

        scanPathObliquus1_7x7: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+0+"_"+0);
            pathItem=new PathItem(0,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+1);
            pathItem=new PathItem(1,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+2);
            pathItem=new PathItem(2,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+3);
            pathItem=new PathItem(3,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+4);
            pathItem=new PathItem(4,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+5);
            pathItem=new PathItem(4,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+6+"_"+6);
            pathItem=new PathItem(4,4,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus2_7x7: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+6+"_"+0);
            pathItem=new PathItem(6,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+1);
            pathItem=new PathItem(5,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+2);
            pathItem=new PathItem(4,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+3);
            pathItem=new PathItem(3,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+4);
            pathItem=new PathItem(2,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+5);
            pathItem=new PathItem(1,5,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+0+"_"+6);
            pathItem=new PathItem(0,6,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },


        scanPathObliquus1_7x6: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+5+"_"+0);
            pathItem=new PathItem(5,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+1);
            pathItem=new PathItem(4,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+2);
            pathItem=new PathItem(3,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+3);
            pathItem=new PathItem(2,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+4);
            pathItem=new PathItem(1,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+0+"_"+5);
            pathItem=new PathItem(0,5,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus2_7x6: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+6+"_"+1);
            pathItem=new PathItem(6,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+2);
            pathItem=new PathItem(5,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+3);
            pathItem=new PathItem(4,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+4);
            pathItem=new PathItem(3,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+5);
            pathItem=new PathItem(2,5,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+6);
            pathItem=new PathItem(1,6,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },

        scanPathObliquus3_7x6: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+0+"_"+1);
            pathItem=new PathItem(0,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+2);
            pathItem=new PathItem(1,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+3);
            pathItem=new PathItem(2,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+4);
            pathItem=new PathItem(3,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+5);
            pathItem=new PathItem(4,5,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+6);
            pathItem=new PathItem(5,6,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus4_7x6: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+1+"_"+0);
            pathItem=new PathItem(1,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+1);
            pathItem=new PathItem(2,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+2);
            pathItem=new PathItem(3,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+3);
            pathItem=new PathItem(4,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+4);
            pathItem=new PathItem(5,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+6+"_"+5);
            pathItem=new PathItem(6,5,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },

        scanPathObliquus1_7x5: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+4+"_"+0);
            pathItem=new PathItem(4,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+1);
            pathItem=new PathItem(3,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+2);
            pathItem=new PathItem(2,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+3);
            pathItem=new PathItem(1,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+0+"_"+4);
            pathItem=new PathItem(0,4,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },


        scanPathObliquus2_7x5: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+0+"_"+2);
            pathItem=new PathItem(0,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+3);
            pathItem=new PathItem(1,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+4);
            pathItem=new PathItem(2,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+5);
            pathItem=new PathItem(3,5,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+6);
            pathItem=new PathItem(4,6,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },

        scanPathObliquus3_7x5: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+2+"_"+6);
            pathItem=new PathItem(2,6,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+5);
            pathItem=new PathItem(3,5,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+4);
            pathItem=new PathItem(4,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+3);
            pathItem=new PathItem(5,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+6+"_"+2);
            pathItem=new PathItem(6,2,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },


        scanPathObliquus4_7x5: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+2+"_"+0);
            pathItem=new PathItem(2,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+1);
            pathItem=new PathItem(3,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+2);
            pathItem=new PathItem(4,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+3);
            pathItem=new PathItem(5,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+6+"_"+4);
            pathItem=new PathItem(6,4,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },

        scanPathObliquus1_7x4: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+3+"_"+0);
            pathItem=new PathItem(3,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+1);
            pathItem=new PathItem(2,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+2);
            pathItem=new PathItem(1,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+0+"_"+3);
            pathItem=new PathItem(0,3,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus2_7x4: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+0+"_"+3);
            pathItem=new PathItem(0,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+4);
            pathItem=new PathItem(1,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+5);
            pathItem=new PathItem(2,5,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+6);
            pathItem=new PathItem(3,6,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },

        scanPathObliquus3_7x4: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+3+"_"+6);
            pathItem=new PathItem(3,6,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+5);
            pathItem=new PathItem(4,5,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+4);
            pathItem=new PathItem(5,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+6+"_"+3);
            pathItem=new PathItem(6,3,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus4_7x4: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+3+"_"+0);
            pathItem=new PathItem(3,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+1);
            pathItem=new PathItem(4,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+2);
            pathItem=new PathItem(5,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+6+"_"+3);
            pathItem=new PathItem(6,3,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },


        scanPathObliquus1_7x3: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+2+"_"+0);
            pathItem=new PathItem(2,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+1);
            pathItem=new PathItem(1,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+0+"_"+2);
            pathItem=new PathItem(0,2,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus2_7x3: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+0+"_"+4);
            pathItem=new PathItem(0,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+5);
            pathItem=new PathItem(1,5,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+6);
            pathItem=new PathItem(2,6,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },

        scanPathObliquus3_7x3: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+4+"_"+6);
            pathItem=new PathItem(4,6,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+5);
            pathItem=new PathItem(5,5,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+6+"_"+4);
            pathItem=new PathItem(6,4,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus4_7x3: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+4+"_"+0);
            pathItem=new PathItem(4,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+5+"_"+1);
            pathItem=new PathItem(5,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+6+"_"+2);
            pathItem=new PathItem(6,2,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },



        scanPathObliquus1_5x5: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+0+"_"+0);
            pathItem=new PathItem(0,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+1);
            pathItem=new PathItem(1,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+2);
            pathItem=new PathItem(2,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+3);
            pathItem=new PathItem(3,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+4);
            pathItem=new PathItem(4,4,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus2_5x5: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+4+"_"+0);
            pathItem=new PathItem(4,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+1);
            pathItem=new PathItem(3,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+2);
            pathItem=new PathItem(2,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+3);
            pathItem=new PathItem(1,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+0+"_"+4);
            pathItem=new PathItem(0,4,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },



        scanPathObliquus1_5x3: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+2+"_"+0);
            pathItem=new PathItem(2,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+1);
            pathItem=new PathItem(1,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+0+"_"+2);
            pathItem=new PathItem(0,2,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus2_5x3: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+0+"_"+2);
            pathItem=new PathItem(0,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+3);
            pathItem=new PathItem(1,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+4);
            pathItem=new PathItem(2,4,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },

        scanPathObliquus3_5x3: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+2+"_"+4);
            pathItem=new PathItem(2,4,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+3);
            pathItem=new PathItem(3,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+2);
            pathItem=new PathItem(4,2,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus4_5x3: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+4+"_"+2);
            pathItem=new PathItem(4,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+1);
            pathItem=new PathItem(3,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+0);
            pathItem=new PathItem(2,0,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },


        scanPathObliquus1_5x4: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+0+"_"+1);
            pathItem=new PathItem(0,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+2);
            pathItem=new PathItem(1,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+3);
            pathItem=new PathItem(2,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+4);
            pathItem=new PathItem(3,4,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus2_5x4: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+1+"_"+0);
            pathItem=new PathItem(1,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+1);
            pathItem=new PathItem(2,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+2);
            pathItem=new PathItem(3,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+4+"_"+3);
            pathItem=new PathItem(4,3,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },

        scanPathObliquus3_5x4: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+3+"_"+0);
            pathItem=new PathItem(3,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+1);
            pathItem=new PathItem(2,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+2);
            pathItem=new PathItem(1,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+0+"_"+3);
            pathItem=new PathItem(0,3,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },   

        scanPathObliquus4_5x4: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+4+"_"+1);
            pathItem=new PathItem(4,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+3+"_"+2);
            pathItem=new PathItem(3,2,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+3);
            pathItem=new PathItem(2,3,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+4);
            pathItem=new PathItem(1,4,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },

        scanPathObliquus1_3x3: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+0+"_"+0);
            pathItem=new PathItem(0,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+1);
            pathItem=new PathItem(1,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+2+"_"+2);
            pathItem=new PathItem(2,2,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        },         


        scanPathObliquus2_3x3: function(){
            let self=this;
            let path=[];
            let item=null;
            let pathItem=null;
            item=self.board.get("elem_"+2+"_"+0);
            pathItem=new PathItem(2,0,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+1+"_"+1);
            pathItem=new PathItem(1,1,(item==="" ? "#" : item));
            path.push(pathItem);
            item=self.board.get("elem_"+0+"_"+2);
            pathItem=new PathItem(0,2,(item==="" ? "#" : item));
            path.push(pathItem);
            return path;
        }, 


        buildPaths: function(){
            let self=this;
            let paths=[];
            if(self.nbrSeq===3){
                for(let line=0;line<self.nbrSeq;line++){
                    paths.push(self.scanPathHorizontal(self.nbrSeq,line));
                }   
                for(let col=0;col<self.nbrSeq;col++){
                    paths.push(self.scanPathVertical(self.nbrSeq,col));
                } 
                paths.push(self.scanPathObliquus1_3x3());
                paths.push(self.scanPathObliquus2_3x3());
            }

            if(self.nbrSeq===5){
                for(let line=0;line<self.nbrSeq;line++){
                    paths.push(self.scanPathHorizontal(self.nbrSeq,line));
                }   
                for(let col=0;col<self.nbrSeq;col++){
                    paths.push(self.scanPathVertical(self.nbrSeq,col));
                } 
                paths.push(self.scanPathObliquus1_5x5());
                paths.push(self.scanPathObliquus2_5x5());

                paths.push(self.scanPathObliquus1_5x4());
                paths.push(self.scanPathObliquus2_5x4());
                paths.push(self.scanPathObliquus3_5x4());
                paths.push(self.scanPathObliquus4_5x4());

                paths.push(self.scanPathObliquus1_5x3());
                paths.push(self.scanPathObliquus2_5x3());
                paths.push(self.scanPathObliquus3_5x3());
                paths.push(self.scanPathObliquus4_5x3());

            }
            if(self.nbrSeq===7){
                for(let line=0;line<self.nbrSeq;line++){
                    paths.push(self.scanPathHorizontal(self.nbrSeq,line));
                }   
                for(let col=0;col<self.nbrSeq;col++){
                    paths.push(self.scanPathVertical(self.nbrSeq,col));
                } 
                paths.push(self.scanPathObliquus1_7x7());
                paths.push(self.scanPathObliquus2_7x7());

                paths.push(self.scanPathObliquus1_7x6());
                paths.push(self.scanPathObliquus2_7x6());
                paths.push(self.scanPathObliquus3_7x6());
                paths.push(self.scanPathObliquus4_7x6());


                paths.push(self.scanPathObliquus1_7x5());
                paths.push(self.scanPathObliquus2_7x5());
                paths.push(self.scanPathObliquus3_7x5());
                paths.push(self.scanPathObliquus4_7x5());


                paths.push(self.scanPathObliquus1_7x4());
                paths.push(self.scanPathObliquus2_7x4());
                paths.push(self.scanPathObliquus3_7x4());
                paths.push(self.scanPathObliquus4_7x4());

                paths.push(self.scanPathObliquus1_7x3());
                paths.push(self.scanPathObliquus2_7x3());
                paths.push(self.scanPathObliquus3_7x3());
                paths.push(self.scanPathObliquus4_7x3());

            }
            return paths;
        },

        evaluatePath: function(path){
            console.log(" evaluatePath");
            let self=this;
            let points=0; 
            let pointsO=0;
            let pointsX=0;
            let lenX=0;
            let lenO=0;
            let lenH=0;
            let len=path.length;
            for(let pathItem in path){
                lenX+=(path[pathItem].item==="X" ? 1 : 0);
                lenO+=(path[pathItem].item==="O" ? 1 : 0);
                lenH+=(path[pathItem].item==="#" ? 1 : 0);
            }

            if(lenX===len){
                self.game.over=true;
                self.game.winner="X";
                self.winnerPath=path;
                points=-1000;
                return points;
            }
            if(lenO===len){
                self.game.over=true;
                self.game.winner="O";
                self.winnerPath=path;
                points=1000;
                return points;
            }
            if((lenX===1)&&(lenO===1)){
                points-=50/(len-lenX);
            }
            if((lenX===1)&&(lenO>=1)){
                points-=200/(len-lenX);
            }
            if((lenX===1)&&(lenO===0)){
                points-=75/(len-lenX);
            }
            if((lenX>1)&&(lenO===0)){
                points-=100/(len-lenX);
            }   
            if((lenO===1)&&(lenX>=1)){
                points+=200/(len-lenO);
            }
            if((lenO===1)&&(lenX===0)){
                points+=75/(len-lenO);
            }
            if((lenO>1)&&(lenX===0)){
                points+=100/(len-lenO);
            }

            
            /*
            if(lenO===len){
                self.game.over=true;
                self.game.winner="O";
                points=-1000;
                self.winnerPath=path;
                return points;
            }else{
                if((lenO===1)&&(lenX>0)){
                    points=(lenO-lenX)/len;
                }
            }
            *    
                /*





            console.log(path);
            console.log("lenX="+lenX);
            console.log("lenO="+lenO);
            console.log("lenH="+lenH);
            //DEFENSE
            


            
            if((lenX>1)&&(lenO===1)&&(len===3)){
                epoints+=250;    
            }

            //ATTACK
            for(let i=0;i<=len;i++){
                if((lenO===i)&&(lenH===len-i)){
                    epoints=epoints+((200/len*2)*(i+1));
                }    
            }
            //END
            if(lenO===len){
                self.game.over=true;
                self.game.winner="O";
                epoints=1000;
                self.winnerPath=path;
                return epoints;
            }  

            //DEFENSE
            if((lenO>1)&&(lenX===1)&&(len===3)){
                epoints-=250;    
            }
            //ATTACK
            for(let i=0;i<=len;i++){
                if((lenX===i)&&(lenH===len-i)){
                    epoints=epoints-(200/len*2)*(i+1);
                }    
            }
            //END
            if(lenX===len){
                self.game.over=true;
                self.game.winner="X";
                epoints=-1000;
                self.winnerPath=path;
                return epoints;
            }    

            */
            return points===0 && len>3 ? -100/len : points;        
        },


        evaluate: function(){
            let self=this;
            
            let points=0;
            console.log(self.paths);
            self.paths=self.buildPaths();
            console.log("PATHS");
            console.log(self.paths);
            for(let path in self.paths){
                points+=self.evaluatePath(self.paths[path]);
                console.log("POINTS:"+points);
                if(self.game.over){
                    break;
                }
            
            }
            if(self.boardFull()){
                self.game.over=true;

            }
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
