const form = document.getElementById('form');
const inputs = document.getElementsByTagName('input');
const modalContainer = document.querySelector('.modal-container');
const closeModalBtn = document.querySelector('.close-button');
let formData ={};
let errorMessage;

const inputsList = [...inputs];


closeModalBtn.addEventListener('click',(e)=>{
    modalContainer.style.display = 'none';
});

inputsList.forEach((item)=>{
    item.addEventListener('focusout',(e)=>{
        if(item.value == ""){
            item.classList.add('not-valid')
            item.classList.remove('valid')
        }
        else{
            item.classList.remove('not-valid')
            item.classList.add('valid')
        }
    })
})

form.addEventListener('submit',(e)=>{
    formData = {
        gagePressure:Number(e.target.GP.value),
        atmospherPressure:Number(e.target.AP.value),
        gageTemperature:Number(e.target.GT.value),
        co2:e.target.CO.value,
        n2:e.target.N2.value,
        grav:e.target.grav.value,
    };

    if(validationResult(formData)!= true){
        modalContainer.style.display = 'flex'
        document.querySelector('.message-text').innerText = errorMessage;
    }
    else{
        processor(formData);
        e.preventDefault();
    }

    
    e.preventDefault();
});


function validationResult(obj){

    if(obj.gagePressure == "")
    errorMessage = "the value of 'Gage Pressure' is empty";
    else if(obj.atmospherPressure == "")
    errorMessage = "the value of 'Atmospher Pressure' is empty";
    else if(obj.gageTemperature == "")
    errorMessage = "the value of 'Gage Temperature' is empty";
    else if(obj.co2 == "")
    errorMessage = "the value of 'CO2' is empty";
    else if(obj.n2 == "")
    errorMessage = "the value of 'n2' is empty";
    else if(obj.grav == "")
    errorMessage = "the value of 'Grav' is empty";

    else
    return true;
    
    return errorMessage;
}

function processor(obj){
    const moreDetail = {
        ap: obj.gagePressure + obj.atmospherPressure,
        tf: obj.gageTemperature * 1.8 + 32,
        mc: obj.co2,
        mn: obj.n2,
        fp(){
            return 156.47/(160.8-7.22*obj.grav+(this.mc-0.392*this.mn));    
        },
        ft(){
            return 226.29/(99.15+211.9*obj.grav- (this.mc+1.681*this.mn));
        },
        padj(){
            return (this.ap- 14.7)*this.fp();
        },
        tadj(){
            return ((this.tf+460)*this.ft())-460
        },
        pii(){
            return (this.padj()+14.7)/1000
        },
        tau(){
            return (this.tadj()+460)/500
        },
        m(){
            return 0.0330378*this.tau()**(-2)-0.0221323*this.tau()**(-3)+0.0161353*this.tau()**(-5);
        },
        n(){
            return (0.265827*this.tau()**(-2)+0.0457697* this.tau()**(-4)-0.133185*this.tau()**(-1))/this.m()
        },
        b2(){
            return (3-this.m()*this.n()**2) / (9*this.m()*this.pii()**2)
        },
        e(){
            return 1-0.00075*this.pii()**2.3*(2-(2.718281828459045**(-20*(1.09-this.tau()))))
        },
        e2(){
            return this.e()-1.317*(1.09-this.tau())**4*this.pii()*(1.69-this.pii()**2)
        },
        b1(){
            return (9*this.n()-2*this.m()*this.n()**3)/(54*this.m()*this.pii()**3)
        },
        b11(){
            return this.b1()-this.e2()/(2*this.m()*this.pii()**2)
        },
        d(){
            return this.b11()+(this.b11()**2+this.b2()**3)**0.5;
        },
        d2(){
            return this.d()**(1/3);
        },
        fpv(){
            return (this.b2()/this.d2())-this.d2()+(this.n()/(3*this.pii()));
        },
        fpv2(){
            return this.fpv()**0.5;
        },
        fpv3(){
            return this.fpv2()/(1+(0.00132/this.tau()**3.25));
        },
        cp(){
            return this.ap/14.696;
        },
        ct(){
            return (273.15+15.56)/(273.15+obj.gageTemperature);
        },
        cz(){
            return this.fpv3()**2;
        }
    };
    console.log("ap:" , moreDetail.ap);
    console.log("tf:",moreDetail.tf);
    console.log("mc:",moreDetail.mc);
    console.log("mn:",moreDetail.mn);
    console.log("fp:",moreDetail.fp());
    console.log("ft:",moreDetail.ft());
    console.log("padj:",moreDetail.padj());
    console.log("tadj:",moreDetail.tadj());
    console.log("pii:",moreDetail.pii());
    console.log("tau:",moreDetail.tau());
    console.log("m:",moreDetail.m());
    console.log("n:",moreDetail.n());
    console.log("b2:",moreDetail.b2());
    console.log("e:",moreDetail.e());
    console.log("e2:",moreDetail.e2());
    console.log("b1:",moreDetail.b1());
    console.log("b11:",moreDetail.b11());
    console.log("d:",moreDetail.d());
    console.log("d2:",moreDetail.d2());
    console.log("fpv:",moreDetail.fpv());
    console.log("fpv:",moreDetail.fpv2());
    console.log("fpv:",moreDetail.fpv3());
    console.log("cp:",moreDetail.cp());
    console.log("ct:",moreDetail.ct());
    console.log("cz:",moreDetail.cz());





};


