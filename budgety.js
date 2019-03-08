var budgetController=(function(){
	var income=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
	};
	var expense=function(id,description,value){
		this.id=id;
		this.description=description;
		this.value=value;
	};
	var calcTotal=function(type)
	{var sum=0;
		data.allItems[type].forEach(function(curr){
			sum=sum+parseInt(curr.value,10);
		})
		data.totals[type]=sum;
}
	var data={
		allItems:{
			exp:[],
			inc:[]
		},
		totals:{
			exp:0,
			inc:0,
			budget:0,
			percentage:0
		}

	}
	return{
		addItem:function(type,description,value)
		{var newItem;var ID;
			if(data.allItems[type].length>0)
				ID=data.allItems[type][data.allItems[type].length-1].id+1;
			else
				ID=0;
			
			if(type==="inc")
				newItem=new income(ID,description,value);
			else newItem=new expense(ID,description,value);
			data.allItems[type].push(newItem);
		   return newItem;
		},
		calcBudget:function(type){
			calcTotal(type);
			if(data.allItems.exp.length>0)
			data.totals.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
		   else data.totals.percentage=0;
			data.totals.budget=data.totals.inc-data.totals.exp;
			
			return {
				income:data.totals.inc,
				expenditure:data.totals.exp,
				budget:data.totals.budget,
				expensesPercentage:data.totals.percentage
			}
		},
		calculateAgain(type,id){
			var arr=[];
			
            data.totals[type]=data.totals[type]-data.allItems[type][id].value;
			data.allItems[type].splice(id,1);
			arr=data.allItems[type];
			data.totals.budget=data.totals.inc-data.totals.exp;
		    data.totals.percentage=Math.round((data.totals.exp/data.totals.budget)*100);
		    return{
		        objArray:arr,
		    	newType:data.totals[type],
		    	newBudget:data.totals.budget,
		    	newPercentage:data.totals.percentage

		    }
			

		},
	}
     



})();
var UIDesignController=(function(){
	var DOMStrings={
		InputType:".add__type",
		InputDescription:".add__description",
		InputValue:".add__value",
		InputButton:".add__btn" ,
		incomeContainer:'.income__list',
		expenseContainer:'.expenses__list',
		incomeValue:'.budget__income--value',
		expenditurevalue:'.budget__expenses--value',
		BudgetValue:'.budget__value',
		expensesPercentage:'.budget__expenses--percentage',
		container:'.container',
		month:'budget__title--month'
	}
	return{

		getInput:function(){
			return{

			    type:document.querySelector(DOMStrings.InputType).value,
			    description:document.querySelector(DOMStrings.InputDescription).value,
			    value:document.querySelector(DOMStrings.InputValue).value,
			    button:document.querySelector(DOMStrings.InputButton).value
		          }
	         },
	    getDOMstrings:function(){
	    	return DOMStrings;
	    },
	    addToUI:function(obj,type){
	    	var html,newHtml,element;
	    	if(type==="inc")
	    	{   element=DOMStrings.incomeContainer;
	    		html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete" ><button class="item__delete--btn" id="income_item_delete"><i class="ion-ios-close-outline"></i></button></div> </div></div>'

	    	}
	    	else{element=DOMStrings.expenseContainer;
	    		html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn" id="expenditure_item_delete"><i class="ion-ios-close-outline"></i></button></div> </div>'
	    	}
	    	newHtml=html.replace('%id%',obj.id);
	    	newHtml=newHtml.replace('%description%',obj.description);
	    	newHtml=newHtml.replace('%value%',obj.value);
	    	
	    	 document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
 
	    },
	    clearFields:function(){
	    	var fields;
	    	fields=document.querySelectorAll(DOMStrings.InputDescription+','+DOMStrings.InputValue);
	    	var fieldsArray=Array.prototype.slice.call(fields);
	    	fieldsArray.forEach(function(current,index,array){
	    		current.value="";
	    	})
	    },
	    updateUI:function(budgetCalculation){
	    	
	    	document.querySelector(DOMStrings.incomeValue).textContent='+'+budgetCalculation.income;
	    	document.querySelector(DOMStrings.expenditurevalue).textContent='-'+budgetCalculation.expenditure;
	    	document.querySelector(DOMStrings.BudgetValue).textContent=budgetCalculation.budget;
	    	document.querySelector(DOMStrings.expensesPercentage).textContent=budgetCalculation.expensesPercentage+"%"
	    },
	    updateAfterDeletion:function(newCalculation,type){

	    	document.querySelector(DOMStrings.BudgetValue).textContent=newCalculation.newBudget;
	    	document.querySelector(DOMStrings.expensesPercentage).textContent=newCalculation.newPercentage;
	    	if(type=='inc')
	    		document.querySelector(DOMStrings.incomeValue).textContent=newCalculation.newType;
	    	else
	    		document.querySelector(DOMStrings.expenditurevalue).textContent=newCalculation.newType;


	    },
	    setMonth:function(monthList,n){
	    document.querySelector('.budget__title--month').textContent=monthList[n];

	    }


}})();





var controller=(function(budgetCtrl,UIDesignCtrl){
	 var setupEvents=function()
	 {  month();
	var DOM=UIDesignCtrl.getDOMstrings();
    document.querySelector(DOM.InputButton).addEventListener("click",ctrlAddItem);
    document.addEventListener("keypress",function(event){
    	if(event.keyCode==13 || event.which==13)
    		ctrlAddItem();
         });
    document.querySelector(DOM.container).addEventListener('click',function(event){
       var myID,idItems;
       idItems=[];
        myID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(myID)
        {
        	idItems=myID.split('-');
        	var newBudget=budgetCtrl.calculateAgain(idItems[0],idItems[1]);
        	UIDesignCtrl.updateAfterDeletion(newBudget,idItems[0]);

        	UIdisplay(idItems[0],idItems[1]);
        }
        	

    });
    
      }

      function UIdisplay(type,id)
      {
      	
      	document.querySelector("#"+type+"-"+id).textContent="";


      }
      function calculate(type){
      	var budgetDetails=budgetCtrl.calcBudget(type);
      	UIDesignCtrl.updateUI(budgetDetails);

      }
    var ctrlAddItem=function(){
    	var input=UIDesignCtrl.getInput();
    	var newItem=budgetCtrl.addItem(input.type,input.description,input.value);
    	UIDesignCtrl.clearFields();
    	UIDesignCtrl.addToUI(newItem,input.type);
    	calculate(input.type);
    	 

    }
    function month(){
    	var monthList=['January','Feburary','March','April','May','June','July','August','September','October','November','December']
    	var date=new Date();
        var n=date.getMonth();
        console.log(n)
        UIDesignCtrl.setMonth(monthList,n) ;

    };
   
    return{
    	init:function(){
    		 setupEvents();
    	}
    }

    })(budgetController,UIDesignController);
    controller.init();


