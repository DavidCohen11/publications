/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$( function() {
    
    $.widget( "tick-tack-toe.ttt_element", {
        options: {
       
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
            this.build;
            this._on( this.element, {
                "dblclick": function( event ) {
                    event.preventDefault();
                    if((self.editable)&&($("#board").ttt_board("getTurn")==="O")){
                        if(self.value===""){
                            self.value="O";
                            self.build();
                            $("#board").ttt_board("setTurn","X");
                            $("#board").ttt_board("setXDone",false);
                            $("#board").ttt_board("setODone",true);
                        }
                        self.editable=false;
                    }    
                }
            });
            
            this._refresh();
        },     
        build: function(){
            let self=this;
            let color="red";
            if(self.value==="O"){
                color="blue";
            }
            let html="<div class=\"element-"+color+"\">"+self.value+"</div>"; 
            $("#"+self.id).html(html);
        },

        getValue: function(){
            let self=this;
            return self.value;
        },

        setValue: function(value){
            let self=this;
            self.value=value;
        },
        
        setEditable: function(value){
            let self=this;
            self.editable=value;
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

