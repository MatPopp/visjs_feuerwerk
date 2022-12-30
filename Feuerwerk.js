
      function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

      
class RocketBase {
  constructor(id,color,x,y){
    this.id = id
    this.label = "RocketBase"
    this.title = color
    this.fixed = true
    this.color = color
    this.x = x
    this.y = y
    this.shape = "database"
    this.fire = function(){
      let position = network.getPosition(this.id)
      shot(position.x,position.y-10,nodes.get(this.id).color)
    }
    console.log(this)
  }
}

class Fountain {
  constructor(id,color,x,y){
    this.id = id
    this.label = "Fountain"
    this.title = color
    this.fixed = true
    this.color = color
    this.x = x
    this.y = y
    this.shape = "triangle"
    this.fire = function(){
      let position = network.getPosition(this.id)
      spray(position.x,position.y-10,nodes.get(this.id).color)
    }
    console.log(this)
  }
}





function shot(x,y,color){
    let new_id = uuidv4()
    console.log('bin in release_shot')
    nodes.update({id:new_id,
      label:"bomb",
      x:x,
      y:y,
      mass:10000,
      color:"black",
      shape:"dot",
      hidden:false,
      physics:true})
  window.setTimeout(function(){

  let position=network.getPosition(new_id)
  
  console.log(explosion)
  explosion(position.x,position.y-100,color)

  console.log(nodes.get(new_id))

  network.setSelection({nodes:[new_id],edges:[]})
  network.deleteSelected()
    
  },1000)
  }


function explosion(x,y,color){
  var added_nodes_ids=[];
  for(let i = 0; i < 20; i++){
  let new_id = uuidv4()
  nodes.update({id:new_id,
      label:"pew",
      x:x,
      y:y,
      color:color,
      shape:"dot",
      hidden:false,
      physics:true,}
      )
  added_nodes_ids.push(new_id)

  window.setTimeout(function(){

    console.log("Timeout")
    console.log(added_nodes_ids)
    network.setSelection({nodes:[new_id],edges:[]})
    network.deleteSelected()
      
  },700+300*Math.random())

  }
  
}

function spray(x,y,color){
  var added_nodes_ids=[];
  for(let i = 0; i < 20; i++){

  window.setTimeout(function(){
    let new_id = uuidv4()
  nodes.update({id:new_id,
      label:"pew",
      x:x,
      y:y,
      color:color,
      shape:"dot",
      hidden:false,
      physics:true,}
      )
  added_nodes_ids.push(new_id)
  window.setTimeout(function(){

    console.log("Timeout")
    console.log(added_nodes_ids)
    network.setSelection({nodes:[new_id],edges:[]})
    network.deleteSelected()
      
  },1700+300*Math.random())

  },100*i)
  

  

  }
}

function fire_recursive(node_id){
  node = nodes.get(node_id)
    if ("fire" in node){node.fire()}
    else{
      let conn_edges = network.getConnectedEdges(node.id)
      console.log(conn_edges)
      conn_edges.forEach(function(edge_id){
        
        let edge = edges.get(edge_id)
        if (edge.from == node_id){
          let neighbor_node = nodes.get(edge.to)
          console.log(neighbor_node)
          if (neighbor_node.fire){neighbor_node.fire()}
          else{
            window.setTimeout(function(){
            console.log("no fire, recurse in "+ neighbor_node)
            fire_recursive(edge.to)}
          ,200)
        }
      }
      })
      console.log(network.getConnectedNodes(node.id))
    }
}
  


      var nodes = new vis.DataSet([
        new RocketBase(1,"red",0,0),
        new RocketBase(2,"orange",100,0),
        new RocketBase(3,"yellow",200,0),
        new RocketBase(4,"green",300,0),
        new RocketBase(5,"blue",400,0),
        new RocketBase(6,"purple",500,0),
        new Fountain(7,"red",50,50),
        new Fountain(8,"orange",150,50),
        new Fountain(9,"yellow",250,50),
        new Fountain(10,"green",350,50),
        new Fountain(11,"blue",450,50),
        new Fountain(12,"purple",550,50),
        {id:13,shape:"ellipse",label:"control",color:"gray",x:0,y:200,fixed:true},
        {id:14,shape:"ellipse",label:"control",color:"gray",x:500,y:200,fixed:true},
        {id:15,shape:"ellipse",label:"control",color:"gray",x:250,y:400,fixed:true},

      ]);

      // create an array with edges
      var edges = new vis.DataSet([{from:13,to:1},
        {from:13,to:2},
        {from:13,to:3},
        {from:13,to:4},
        {from:13,to:5},
        {from:13,to:6},
        {from:14,to:7},
        {from:14,to:8},
        {from:14,to:9},
        {from:14,to:10},
        {from:14,to:11},
        {from:14,to:12},

        {from:15,to:13},
        {from:15,to:14},


        
      ]);

      // create a network
      var container = document.getElementById("mynetwork");
      var data = {
        nodes: nodes,
        edges: edges,
      };

      var options = {
        interaction: { hover: true },
        manipulation: {
          enabled: true,
        },
      };

      var network = new vis.Network(container, data, options);

      network.on("click", function (params) {
        params.event = "[original event]";
        
        console.log(
          "click event, getNodeAt returns: " +
            params.nodes
        );
        let node_id = params.nodes[0]
        if (params.nodes.length>0){
          
          fire_recursive(node_id)
        }
        console.log('click event finished')
      });






      network.on("doubleClick", function (params) {
        params.event = "[original event]";
        document.getElementById("eventSpanHeading").innerText =
          "doubleClick event:";
        document.getElementById("eventSpanContent").innerText = JSON.stringify(
          params,
          null,
          4
        );

	if (params.nodes.length>0){
		position = network.getPosition(params.nodes[0])
		console.log(network)
		release_shot(position.x,position.y-10,nodes.get(params.nodes[0]).color)	
	}
	


      });



	
	
	
	

	






      network.on("oncontext", function (params) {
        params.event = "[original event]";
        document.getElementById("eventSpanHeading").innerText =
          "oncontext (right click) event:";
        document.getElementById("eventSpanContent").innerText = JSON.stringify(
          params,
          null,
          4
        );
      });


      
    network.on('dragEnd', function (params) {
      console.log(params.nodes)
      if (params.nodes.length>0){
          node=nodes.get(params.nodes[0])
          position = network.getPosition(params.nodes[0])   //setting the current position is necessary to prevent snap-back to initial position
          console.log(position)
          node.x=position.x
          node.y=position.y   
          node.fixed=true
          
          nodes.update(node)
      }
      
  });


  network.on('dragStart', function (params) {
      if (params.nodes.length>0){
          
          var node=nodes.get(params.nodes[0])
          position = network.getPosition(params.nodes[0])  //setting the current position is necessary to prevent snap-back to initial position
          console.log(position)
          node.x=position.x
          node.y=position.y
          node.fixed=false
          console.log(node)
          nodes.update(node)
      }
  });
      network.on("controlNodeDragging", function (params) {
        params.event = "[original event]";
        document.getElementById("eventSpanHeading").innerText =
          "control node dragging event:";
        document.getElementById("eventSpanContent").innerText = JSON.stringify(
          params,
          null,
          4
        );
      });
      network.on("controlNodeDragEnd", function (params) {
        params.event = "[original event]";
        document.getElementById("eventSpanHeading").innerText =
          "control node drag end event:";
        document.getElementById("eventSpanContent").innerText = JSON.stringify(
          params,
          null,
          4
        );
        console.log("controlNodeDragEnd Event:", params);
      });
      network.on("zoom", function (params) {
        document.getElementById("eventSpanHeading").innerText = "zoom event:";
        document.getElementById("eventSpanContent").innerText = JSON.stringify(
          params,
          null,
          4
        );
      });
      network.on("showPopup", function (params) {
        document.getElementById("eventSpanHeading").innerText =
          "showPopup event: ";
        document.getElementById("eventSpanContent").innerText = JSON.stringify(
          params,
          null,
          4
        );
      });
      network.on("hidePopup", function () {
        console.log("hidePopup Event");
      });
      network.on("select", function (params) {
        console.log("select Event:", params);
      });
      network.on("selectNode", function (params) {
        console.log("selectNode Event:", params);
      });
      network.on("selectEdge", function (params) {
        console.log("selectEdge Event:", params);
      });
      network.on("deselectNode", function (params) {
        console.log("deselectNode Event:", params);
      });
      network.on("deselectEdge", function (params) {
        console.log("deselectEdge Event:", params);
      });
      network.on("hoverNode", function (params) {
        console.log("hoverNode Event:", params);
      });
      network.on("hoverEdge", function (params) {
        console.log("hoverEdge Event:", params);
      });
      network.on("blurNode", function (params) {
        console.log("blurNode Event:", params);
      });
      network.on("blurEdge", function (params) {
        console.log("blurEdge Event:", params);
      });