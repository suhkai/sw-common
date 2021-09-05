/**
 * Created by jacobbogers on 6/11/16.
 */

 function ll(str) {
    console.log(str);
  }
  
  /* tooling */
  /* tooling */
  /* tooling */
  
  function storageAvailable(type) {
      try {
          var storage = window[type],
              x = '__storage_test__';
          storage.setItem(x, x);
          storage.removeItem(x);
          return true;
      }
      catch(e) {
          return false;
      }
  }
  
  
  function add_attrs(elt, obj) {
  
    var keys = Object.keys(obj);
  
    keys.forEach(function(c) {
      elt.setAttribute(c, obj[c]);
    });
  
    var add_a = add_attrs.bind(undefined, elt);
  
    return {
      add_attrs: add_a
    };
  
  }
  
  
  function add_classes(elt, classnames) {
    if (typeof elt == "string") {
      elt = document.getElementById(elt);
    }
    if (!(classnames instanceof Array)) {
      classnames = [classnames];
    }
    for (var i = 0; i < classnames.length; i++) {
      elt.classList.add(classnames[i]);
    }
    return elt;
  }
  
  function remove_classes(elt, classnames) {
    if (typeof elt == "string") {
      elt = document.getElementById(elt);
    }
    if (!(classnames instanceof Array)) {
      classnames = [classnames];
    }
    for (var i = 0; i < classnames.length; i++) {
      elt.classList.remove(classnames[i]);
    }
    return elt;
  }
  
  
  function async_call(func) {
    window.setTimeout(func, 1);
    /* its about async not about delay time*/
  }
  
  /** data model */
  /** data model */
  /** data model */
  
  function create_model_init(pk) {
    var model = {
      recipe_id: undefined,
      ingredient_id: 0,
      ingredients: [],
  
      init: function(recipe_pk) {
        this.recipe_id = recipe_pk;
        this.ingredient_id = 0;
      },
      get_pk: function(child_pk) {
        if (!child_pk) {
          return this.recipe_id + '_' + this.ingredient_id;
        }
        var idx = this.find_ingredient_idx(child_pk);
        if (idx) {
          return this.recipe_id + '_' + this.ingredients[idx].pk;
        }
        throw new Error('could not aquire pk');
      },
      get_pk_at: function(idx) {
        var pk = this.ingredients[idx].pk;
        return this.recipe_id + '_' + pk;
      },
      next_pk: function() {
        this.ingredient_id++;
      },
      push_ingr: function() {
        var obj = {
          pk: this.ingredient_id,
          name: '',
          state: 0 // this means tentative
        };
        this.ingredients.push(obj);
      },
      find_ingredient_idx: function(pk) {
        var i = 0;
        for (i = 0; i < this.ingredients.length; i++) {
          if (pk == this.ingredients[i].pk) {
            return i;
          }
        }
        return -1;
      },
      get_ingredient_by_pk: function(pk) {
        var idx = this.find_ingredient_idx(pk);
        if (idx >= 0) {
          return this.ingredients[idx];
        }
        return undefined;
      },
      delete_by_pk: function(pk) {
        var idx = this.find_ingredient_idx(pk);
        if (idx >= 0) {
          this.ingredients.splice(idx, 1);
        }
      },
      commit: function(pk, name) {
        var val = this.get_ingredient_by_pk(pk);
        if (val) {
          val.state = 1;
          val.name = name;
        }
      },
      is_edited: function() {
        for (var i = this.ingredients.length - 1; i >= 0; i--) {
          var val = this.ingredients[i];
          if (val.state == 0) {
            return val.pk; // even if i==0 ,it will mark it as true
          }
        }
        return undefined;
      },
      delete_all: function() {
        this.ingredients.splice(0);
      },
      get_recipe_node: function() {
        return this.ingredients[0].container;
      },
      last_node: function() {
        if (this.ingredients.length > 0) {
          return this.ingredients[this.ingredients.length - 1].container;
        }
      },
      last: function() {
        return this.ingredients[this.ingredients.length - 1];
      },
      length: function() {
        return this.ingredients.length;
      }
  
    };
    model.init(pk);
    return model;
  }
 
  
  /** Recipe Ingredient */
  /** Recipe Ingredient */
  /** Recipe Ingredient */
  
  var Ingredient = React.createClass({
  
    _ll: function(str) {
        //used to me more complex
        var pk_str = this.pk_str;
        ll(str + "[" + pk_str + "]");
    },
  
    _add_del_clicked:function(evt){
        this._ll('add_del_clicked');
        var m = this.props.model;
        var id = this.props.mid;
        var i = this.refs.input;
        var elt = m.get_ingredient_by_pk(id);
        i.blur();
        m.delete_by_pk(id);
        if (elt.state == 0){
          this.props.signal_recipe({op:"rollup"});
          return;
        }
        this.props.signal_recipe({op:"delete-ingredient"});
    },
  
    _onFocus: function(evt) {
      ll({
        "on-focus:": this.pk_str,
        "readOnly:": this.refs.input.readOnly
      });
  
      var id = this.props.mid;
      var elt = this.props.model.get_ingredient_by_pk(id);
      if (elt.state == 0) {
        return;
      }
      if (elt.state == 2) {
        // yeah can happen if you switch to debug window in the browser
        // old code: throw new Error('internal error, state cannot be 2 here!');
        return;
      }
      if (elt.state == 1) {
        this.refs.input.readOnly = false;
        elt.state = 2;
        add_classes(this.refs.container, "edit");
      }
      console.log({
        tag: 'input focus',
        token: id
      });
    },
  
    _onBlur: function(evt) {
      ll({
        "on-blur:": this.pk_str,
        "readOnly:": this.refs.input.readOnly
      });
      var id = this.props.mid;
      var elt = this.props.model.get_ingredient_by_pk(id);
      var data = this.refs.input.value;
      var m = this.props.model;
      var c = this.refs.container;
      // doesnt exist anymore, can happen after an explicit delete
      if (elt == undefined) {
        return;
      }
      switch (elt.state) {
        case 0:
          return;
        case 1: //this can happen if after an "enter" the state is set to 1
          break;
        case 2:
          this.refs.input.readOnly = true;
          remove_classes(c, "edit");
          data = (data.length == 0) ? elt.name : data;
          m.commit(id, data);
          this.refs.input.value = data;
          this.props.signal_recipe({op:"save"});
          break;
        default:
          throw new Error('ERROR state is:[' + elt.state + ']')
      }
      console.log({
        tag: 'input blur',
        token: this.pk_str
      });
    },
    _keydown: function(evt) {
      var key = evt.keyCode || evt.wich;
      this._ll("_key_down clicked,key:" + key);
  
      if (key != 13) {
        return;
      }
  
      var data = evt.target.value || '';
      var pk_str = this.pk_str;
      var mid = this.props.mid;
      var elt = this.props.model.get_ingredient_by_pk(mid);
      var m = this.props.model;
      var c = this.refs.container;
      var input = this.refs.input;
      var pk_child_edited;
      data = data.trim();
  
      if (elt.state == 0 && data.length == 0) {
          m.delete_by_pk( mid );
          this.props.signal_recipe({op:"rollup"});
          this._ll("rollup");
          return;
      }
  
      if (elt.state == 0 && data.length > 0) {
        add_classes(c, ["fixed", "turn"]);
        input.readOnly = true;
        m.commit(mid, data);
        //new ingredient
        m.next_pk();
        m.push_ingr();
        input.blur(); //will fire off blur event
        this.props.signal_recipe({op:"new-ingredient"}); // focus will happen after render
        return;
      }
  
      if (elt.state == 2 && data.length > 0) {
        remove_classes(c, "edit");
        m.commit(mid, data);
        input.readOnly = true;
        input.blur(); //will fire off blur event
        this.props.signal_recipe({op:"change-ingredient"});
        return;
      }
  
      if (elt.state == 2 && data.length == 0){
        remove_classes(c, "edit");
        input.readOnly = true;
        input.blur(); //will fire off blur event
        this.props.signal_recipe({op:"move-focus"});
        return;
      }
      this._ll(data);
    },
  
    getInitialState: function() {
      this._ll("getInitialState :" + this.constructor.displayName);
      var m = this.props.model;
      var id = this.props.mid;
      var str = m.get_pk(id);
      this.pk_str = str;
      return null;
    },
  
    componentWillMount: function() {
      this._ll("componentWillMount:" + this.constructor.displayName);
    },
  
    componentWillReceiveProps: function(nextProps) {
      this._ll("componentWillReceiveProps:" + this.constructor.displayName);
    },
  
    componentWillUpdate: function(nextProps, nextState) {
      this._ll("componentWillUpdate:" + this.constructor.displayName);
    },
  
    componentDidUpdate: function(prevProps, prevState) {
      this._ll("componentDidUpdate:" + this.constructor.displayName);
    },
  
    componentWillUnmount: function() {
      this._ll("componentWillUnmount:" + this.constructor.displayName);
    },
  
    componentDidMount: function() {
      this._ll("componentDidMount:" + this.constructor.displayName);
      var c = this.refs.container;
      async_call(function(){
          add_classes(c,"turn");
      });
    },
  
    shouldComponentUpdate: function(nextProps, nextState) {
      this._ll("shouldComponentUpdate:" + this.constructor.displayName);
      return false;
    },
  
    render: function() {
      var id = this.props.mid;//pk of ingredient
      var c = this.refs.container;
      var model = this.props.model;
      var elt = model.get_ingredient_by_pk(id);
  
      function class_detail_edited() {
        if (elt.state != 0) {
          return 'n-edt-detail-container turn fixed';
        }
        return 'n-edt-detail-container';
      }
  
      function get_value() {
        var attrs = {};
        if (elt.state != 0) {
          attrs.defaultValue = elt.name;
          attrs.readOnly = 'true';
        }
        return attrs;
      }
  
      return (
          <div ref = {"container"}
               className = {class_detail_edited()} >
          <input ref = "input"
        className = "new-recipe-inp detail"
        type = "text"
        {...get_value()}
        placeholder = "Enter Ingredient or Empty[Enter] to save"
        onKeyDown = {
          this._keydown
        }
        onFocus = {
          this._onFocus
        }
        onBlur = {
          this._onBlur
        }
        /> <div className = "cross"
        ref = "add-del-btn"
        onClick = {
          this._add_del_clicked
        } >
        <svg version = "1.1"
        xmlns = "http://www.w3.org/2000/svg"
        xmlnsXlink = "http://www.w3.org/1999/xlink"
        viewBox = "0 0 42 42" >
        <line className = "lcl"
        x1 = "21"
        y1 = "0"
        x2 = "21"
        y2 = "42" />
        <line className = "lcl"
        x1 = "42"
        y1 = "21"
        x2 = "0"
        y2 = "21" />
        </svg>
        </div>
        </div>
      );
    }
  });
  
  /** Recipe */
  /** Recipe */
  /** Recipe */
  
  var Recipe = React.createClass({
  
        _ll: function(str) {
            var pk_str = this.pk_str;
  
            ll(str + "[" + pk_str + "]");
        },
        //recipe, "signal_recipe" callback
         _msg_handler: function(msg) {
          var m = this.props.model;
          var _id = this.props.mid;
          if ( !msg ){
              throw new Error('you need to send a message');
          }
          if (msg.op == "rollup"){
              this.setState({rollup:true});
              //forward this message to the application
              this.props.signal_app({op:"rollup", pk:m.recipe_id, id:_id });
              this.props.signal_app({op:"save"});
              return;
          }
          if (msg.op == "delete-ingredient"){
              this.forceUpdate();
              this.props.signal_app({op:"save"});
              return;
          }
          if (msg.op == "new-ingredient"){
              this.forceUpdate();
              this.props.signal_app({op:"save"});
              return;
          }
          if (msg.op == "change-ingredient"){
              this.forceUpdate();
              this.props.signal_app({op:"save"});
              return;
          }
          if (msg.op == "move-focus"){
              this.forceUpdate();
              return;
          }
          throw new Error('Unhandled message!');
        },
  
        _onFocus: function(evt) {
          ll({
            "on-focus:": this.props.pk,
            "readOnly:": this.refs.input.readOnly
          });
  
          var id = this.props.mid;
          var elt = this.props.model.get_ingredient_by_pk(id);
          if (elt.state == 0) {
            return;
          }
          if (elt.state == 2) {
            // yeah can happen if you switch to debug window in the browser
            // old code: throw new Error('internal error, state cannot be 2 here!');
            return;
          }
          if (elt.state == 1) {
            this.refs.input.readOnly = false;
            elt.state = 2;
            add_classes(this.refs.container, "edit");
          }
          console.log({
            tag: 'input focus',
            token: id
          });
        },
  
        _onBlur: function(evt) {
          ll({
            "on-blur:": this.props.pk,
            "readOnly:": this.refs.input.readOnly
          });
          var id = this.props.mid;
          var elt = this.props.model.get_ingredient_by_pk(id);
          var data = this.refs.input.value;
          // doesnt exist anymore, can happen after an explicit delete
          if (elt == undefined) {
            return;
          }
          switch (elt.state) {
            case 0:
              return;
            case 1: //this can happen if after an "enter" the state is set to 1
              break;
            case 2:
              this.refs.input.readOnly = true;
              remove_classes(this.refs.container, "edit");
              data = (data.length == 0) ? elt.name : data;
              this.props.model.commit(0, data);
              this.refs.input.value = data;
              this.props.signal_app({op:"save"});
              break;
            default:
              throw new Error('ERROR state is:[' + elt.state + ']')
          }
          console.log({
            tag: 'input blur',
            token: id
          });
        },
        _btn_expand_click: function(evt) {
          this._ll("_btn_expand_click");
          var m = this.props.model;
          var refs = this.refs;
  
          function delete_edit_child(){
              var pk_edit = m.is_edited();
              if (pk_edit == undefined){
                  return;
              }
              var pk_edit_str = m.get_pk(pk_edit);
              var child = refs[pk_edit_str];
              if (child == undefined){
                  return;
              }
              m.delete_by_pk(pk_edit);
          }
  
          function add_edit_child(){
              m.next_pk();
              m.push_ingr();
          }
  
          var recipe = m.get_ingredient_by_pk(this.props.mid);
          // recipe title is new, do nothing on the button
          if (recipe.state == 0){
              return;
          }
  
          switch (this.state.rollup){
              case true:
                 add_edit_child();
                 this.setState({rollup:false});
                break;
              case false:
                this.setState({rollup:true});
                delete_edit_child();
                this.props.signal_app({ op:"rollup", pk:m.recipe_id });
                break;
          }
        },
  
        _keydown: function(evt) {
          var key = evt.keyCode || evt.wich;
          this._ll("_key_down clicked,key:" + key);
          if (key != 13) {
            return;
          }
          var data = evt.target.value || '';
          var pk_str = this.state.pk_str
          var mid = this.props.mid;
          var elt = this.props.model.get_ingredient_by_pk(mid);
          var m = this.props.model;
          var expand = this.refs['btn-expand'];
          var c = this.refs.container;
          var input = this.refs.input;
          var pk_child_edited;
          data = data.trim();
          if (elt.state == 0 && data.length == 0) {
            return;
          } //
          if (elt.state == 0 && data.length > 0) {
            add_classes(c, ["fixed", "turn"]);
            input.readOnly = true;
            m.commit(mid, data);
            this.setState({rollup:false});
            this.props.signal_app({op:"save"});
            m.next_pk();
            m.push_ingr();
            input.blur(); //will fire off blur event
            return;
          }
          if (elt.state == 2 && data.length > 0) {
            remove_classes(c, "edit");
            m.commit(mid, data);
            this.props.signal_app({op:"save"});
            input.readOnly = true;
            input.blur(); //will fire off blur event
            var pk = m.is_edited();
            if (pk != undefined) {
              var pk_str = m.get_pk(pk);
              var child = this.refs[pk_str];
              child.refs.input.focus();
              return
            }
            this.setState({rollup:false});
            m.next_pk();
            m.push_ingr();
            input.blur(); //will fire off blur event
            return;
          }
          this._ll(data);
        },
  
        _add_del_clicked: function(evt) {
          this._ll("recipe _add_del_clicked clicked:" + this.props.model.recipe_id);
          var m = this.props.model;
          var input = this.refs.input;
          var c = this.refs.container;
          var mid = this.props.mid;
          var state = m.ingredients[mid].state;
          if (state == 0) {
            //roll un roll
            c.classList.toggle('turn');
            input.value = "";
            input.focus();
            return;
          }
          m.delete_all();
          this.props.signal_app({op:"delete-recipe",pk:m.recipe_id});
          this.props.signal_app({op:"save",pk:m.recipe_id});
        },
  
        getInitialState: function() {
          ll("getInitialState :" + this.constructor.displayName);
          var m = this.props.model;
          var id = this.props.mid;
          var str = m.get_pk(id);
          //var elt = m.get_ingredient_by_pk(id);
          return ({rollup:true});
        },
  
        componentWillMount: function() {
          ll("componentWillMount:" + this.constructor.displayName);
        },
  
        componentWillReceiveProps: function(nextProps) {
          ll("componentWillReceiveProps:" + this.constructor.displayName);
        },
  
        componentWillUpdate: function(nextProps, nextState) {
          ll("componentWillUpdate:" + this.constructor.displayName);
        },
  
        componentDidUpdate: function(prevProps, prevState) {
          ll( "componentDidUpdate:" + this.constructor.displayName );
          var m = this.props.model;
          var pk = m.is_edited();
          if (pk != undefined) {
            var pk_str = m.get_pk(pk);
            if (pk > 0){
              var child = this.refs[pk_str];
              child.refs.input.focus();
              return;
            }
            //pk==0 here
            this.refs.input.focus();
          }
        },
  
        componentWillUnmount: function() {
          ll("componentWillUnmount:" + this.constructor.displayName);
        },
  
        componentDidMount: function() {
          ll("componentDidMount:" + this.constructor.displayName);
        },
        shouldComponentUpdate: function(nextProps, nextState) {
          ll("shouldComponentUpdate:" + this.constructor.displayName);
          /*if (this.state.rollup == nextState.rollup){
              return false;
          }*/
          return true;
        },
  
        _render_children: function(){
            var ingredients = [];
            var m = this.props.model;
            for (var i = 1; i < m.ingredients.length; i++) {
              var elt = m.ingredients[i];
              var pk_str = m.get_pk_at(i);
              var ingredient = ( <Ingredient ref = {
                  pk_str
                }
                key = {
                  pk_str
                }
                mid = {
                  elt.pk
                }
                signal_recipe = {
                  this._msg_handler
                }
                model = {
                  this.props.model
                }
                />);
                ingredients.push(ingredient);
           }
           return ingredients;
        },
  
        render: function() {
          var ingredients;
          var m = this.props.model;
          var rollup = this.state.rollup;
  
          if (this.state.rollup == false){
              ingredients = this._render_children();
          }
  
          var pk_str = this.pk_str;
            //m need to do it because of ["this"] nonsense
  
            function class_main_edited() {
              var classes = ["n-edt-container"];
              if (m.ingredients[0].state != 0) {
                classes.push("turn fixed");
              }
              if (roll_down()==true){
                  classes.push("_90deg");
              }
              return classes.join(' ');
            }
  
            function get_value() {
              var attrs = {};
              if (m.ingredients[0].state != 0) {
                attrs.defaultValue = m.ingredients[0].name;
                attrs.readOnly = 'true';
              }
              return attrs;
            }
  
            function roll_down(){
                return (rollup == false);
            }
  
            return ( <div>
              <div key = {
                pk_str
              }
              ref = "container"
              className = {
                class_main_edited()
              } >
              <input ref = "input"
              className = "new-recipe-inp"
              type = "text" {...get_value()
              }
              placeholder = "Enter New Recipe Name"
              onKeyDown = {
                this._keydown
              }
              onFocus = {
                this._onFocus
              }
              onBlur = {
                this._onBlur
              }
  
              /> <div className = "cross"
              ref = "add-del-btn"
              onClick = {
                this._add_del_clicked
              } >
              <svg version = "1.1"
              xmlns = "http://www.w3.org/2000/svg"
              xmlnsXlink = "http://www.w3.org/1999/xlink"
              viewBox = "0 0 42 42" >
              <line className = "lcl"
              x1 = "21"
              y1 = "0"
              x2 = "21"
              y2 = "42" / >
              <line className = "lcl"
              x1 = "42"
              y1 = "21"
              x2 = "0"
              y2 = "21" / >
              </svg> </div>
              <div ref = "btn-expand"
              className = "arrow"
              onClick = {
                this._btn_expand_click
              } >
              <svg version = "1.1"
              xmlns = "http://www.w3.org/2000/svg"
              xmlnsXlink = "http://www.w3.org/1999/xlink"
              viewBox = "0 0 49.656 49.656" >
              <g>
              <polygon points="14.535,48.242 11.707,45.414 32.292,24.828 11.707,4.242 14.535,1.414 37.949,24.828 	"/>
              <path d="M14.535,49.656l-4.242-4.242l20.585-20.586L10.293,4.242L14.535,0l24.829,24.828L14.535,49.656z
         M13.121,45.414l1.414,1.414l22-22l-22-22l-1.414,1.414l20.585,20.586L13.121,45.414z"/>
              </g> </svg> </div> </div>
              {
                ingredients
              }
              </div>);
            }
          });
  
        var App = React.createClass({
  
              _ll: function( str ) {
                ll( str + "[" + this.storage.all_recipies.length + "]" );
              },
  
              _delete_model: function(pk) {
                var recipe;
                var all_recipies = this.storage.all_recipies;
                for (var i = 0; i < all_recipies.length; i++) {
                  recipe = all_recipies[i];
                  if (recipe.recipe_id == pk) {
                    all_recipies.splice(i, 1);
                    this.storage.save();
                    return;
                  }
                }
  
              },
  
              _editing_in_progress:function(){
                  var _edits = this.storage.all_recipies.reduce(function(prev, model, idx, arr) {
                    if (model.is_edited() != undefined) {
                      prev.nr++;
                    }
                    return prev;
                  }, {
                    nr: 0
                  });
                  return (_edits.nr != 0);
              },
              ///App
              _msg_handler: function( msg ) {
                this._ll('message handdler called');
                if (!msg){
                    throw new Error('[App] needs to receive a non empty message');
                }
                if (msg.op == "delete-recipe"){
                   this._delete_model(msg.pk);
                   this.forceUpdate();
                   return;
                }
                if (msg.op == "rollup"){
                    this.forceUpdate();
                    return;
                }
                if (msg.op == "save"){
                    this.storage.save();
                    return;
                }
                throw new Error('[App] received an unknown message:'+msg);
              },
  
              _create_new_recipe_model: function(pk) {
  
                if (pk == undefined) {
                  pk = this.pk_seq;
                }
  
                var model = create_model_init(pk);
                model.push_ingr();
  
                return model;
  
              },
  
              _next_pk: function() {
                this.pk_seq++;
              },
  
              // here is where it all starts
              getInitialState: function() {
  
                  ll("getInitialState:" + this.constructor.displayName);
                  var has_local_store = storageAvailable('localStorage');
                  var storage_app_key = "_Jacob Bogers_recipes_2d6feea08b0ea4b235b89b17c8d5d3b8803baff8";
                  var _create_new_recipe_model = this._create_new_recipe_model;
                  var _next_pk = this._next_pk;
                  this.storage = {

                      all_recipies:[],
                    
                      storage_app_key: has_local_store ? storage_app_key:"",
                    
                      default:function(){
                          var model0 = _create_new_recipe_model();
                          this.all_recipies.push(model0);
                          model0.commit(0, "Spagetti recipe");
                          this.save();
                      },
  
                      load:function(){
                          if (this.storage_app_key.length == 0){
                              this.default();
                              return;
                          }
                          var data = window.localStorage.getItem(this.storage_app_key) || "";
                          data = data.trim();
                          if (data.length == 0){
                              this.default();
                              return;
                          }
                          data = JSON.parse( data );
                          this.all_recipies.splice(0);
                          this.pk_seq = -1;
                          for (var i = 0; i < data.length; i++){
                              if (!data[i].name || data[i].name.trim() == ""){
                                  continue;
                              }
                              _next_pk();
                              var model = _create_new_recipe_model();
                              model.commit(0, data[i].name);
                              this.all_recipies.push(model);
                              if (
                                  !data[i].ingredients
                                  || !(data[i].ingredients instanceof Array)
                                  || data[i].ingredients.length == 0 ){
                                  continue;
                              }
                              for (var j = 0; j < data[i].ingredients.length; j++){
                                  var ingredient = data[i].ingredients[j];
                                  model.next_pk();
                                  model.push_ingr();
                                  model.commit(j+1, ingredient.name );
                              }
  
  
                          }
                          this.pk_seq = Math.max(i-1, 0);
                          console.log(data);
                      },
                      save:function(){
                          if (this.storage_app_key.length == 0){
                              return;
                          }
                          // not use Array.prototype.map here because of "this" drama
                          var save_recipies = [];
                          for (var i = 0; i < this.all_recipies.length; i++ ){
                              var model = this.all_recipies[i];
                              if (model.ingredients.length == 0){
                                  continue;
                              }
                              var recipe = model.ingredients[0];
                              if (recipe.state == 0){
                                  continue;//skip
                              }
                              var recipe = {recipe_id:i, name:recipe.name, ingredients:[]};
                              save_recipies.push(recipe);
                              for (var j = 1 ; j < model.ingredients.length; j++){
                                  var ingredient = model.ingredients[j];
                                  if (ingredient.state == 0){
                                      continue;
                                  }
                                  recipe.ingredients.push({
                                      pk:j,//reformat
                                      state:ingredient.state,
                                      name:ingredient.name
                                  });
                              }
  
                          }
                          window.localStorage.setItem(this.storage_app_key, JSON.stringify(save_recipies));
                      }//save function
                  };//storage object
                  this.pk_seq = 0;
                  this.storage.load();
                  return ( {localstore:has_local_store, storage_key:storage_app_key});
              },
  
              componentWillMount: function() {
                ll("componentWillMount:" + this.constructor.displayName);
              },
  
              componentWillReceiveProps: function(nextProps) {
                ll("componentWillReceiveProps:" + this.constructor.displayName);
              },
  
              componentWillUpdate: function(nextProps, nextState) {
                ll("componentWillUpdate:" + this.constructor.displayName);
              },
  
              componentDidUpdate: function(prevProps, prevState) {
                ll("componentDidUpdate:" + this.constructor.displayName);
              },
  
              componentWillUnmount: function() {
                ll("componentWillUnmount:" + this.constructor.displayName);
              },
  
              componentDidMount: function() {
                ll("componentDidMount:" + this.constructor.displayName);
  
              },
  
              shouldComponentUpdate: function(nextProps, nextState) {
                ll("shouldComponentUpdate:" + this.constructor.displayName);
                return false;
              },
  
              render: function() {
                ll("render:" + this.constructor.displayName);
  
                var model0;
  
                if (this._editing_in_progress() == false) {
                  this._next_pk();
                  model0 = this._create_new_recipe_model();
                  this.storage.all_recipies.unshift( model0 );
                  this.storage.save();
                }
  
                var _msg_handler = this._msg_handler;
                var delete_model = this._delete_model;
                var recipies = this.storage.all_recipies.map(function(model, idx) {
                    return ( <
                      Recipe key = {
                        model.get_pk_at(0)
                      }
                      model = {
                        model
                      }
                      mid = {
                        0
                      }
                      signal_app = {
                        _msg_handler
                      }
                      deleteCallback = {
                        delete_model
                      }
                      />);
                    });
  
                  return ( <
                    div className = "inner-canvas" >
                    <
                    div ref = "recipe"
                    className = "recipe" > {
                      recipies
                    } <
                    /div> <
                    /div>);
                  }
                });
  
  
              window.onload = function() {
                ReactDOM.render( < App / > , document.getElementById("container-anchor"));
              };
  