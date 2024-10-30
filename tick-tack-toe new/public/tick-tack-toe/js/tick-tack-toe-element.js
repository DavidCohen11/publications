/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( function() {
    
    $.widget( "tick-tack-toe.ttt_element", {
        options: {
            col: -1,
            line:-1
        },
        
        // The constructor
        _create: function() {
            var self=this;
            this.id=$(this.element).attr("id");
            this.line=this.options.line;
            this.col=this.options.col;
            this.element.addClass("tick-tack-toe.ttt_element");
            this.value="";
            this.editable=true;
            this.build("normal");
            this._on( this.element, {
                "mouseover": function( event ) {
                    event.preventDefault();
                    if($("#board").ttt_board("getEditable")===true){
                        $("#board").ttt_board("hightlightSelectedPaths");
                    }
                }
            });
            this._on( this.element, {
                "dblclick": function( event ) {
                    event.preventDefault();
                    if($("#board").ttt_board("getEditable")===true){
                        if(self.value===""){
                            self.value="O";
                            self.build("blue");
                            $("#board").ttt_board("setBoard",self.col,self.line,self.value);
                            $("#board").ttt_board("setTurn","X");
                            $("#board").ttt_board("setEditable","false");
                            $("#board").ttt_board("evaluate");
                        }
                        
                    }    
                }
            });
            
            this._refresh();
        },     
        build: function(color){
            let self=this;
            let html="<div class=\"element element-color-"+color+"\">"+self.value+"</div>"; 
            $("#"+self.id).html(html);
        },

        updateBackground: function(newbackground){
            let self=this;
            console.log(newbackground);
            $("#"+self.id).children().css("background-color",newbackground);  
        },


        getValue: function(){
            let self=this;
            return self.value;
        },

        setValue: function(value){
            let self=this;
            self.value=value;
        },

        getCol: function(){
            let self=this;
            return self.col;
        },

        getLine: function(){
            let self=this;
            return self.line;
        },

        // Called when created, and later when changing options
        _refresh: function() {
        },
        // Events bound via _on are removed automatically
        // revert other modifications here
        _destroy: function() {
            // remove generated elements
            this.element.removeClass( "tick-tack-toe.ttt_element" );
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
            this._super( key, value );
        }
    });
});

