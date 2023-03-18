let loadDataService = {
    getData:()=>{
        fetch("../data.json")
        .then(res => res.json())
        .then(res => uIService.showCardsInit(res))
        .catch(err => console.log(err));
    }
}

let uIService = {
    loadingButton: document.querySelector(".loading-button"),
    showCardsInit: function(data){
        let start = 0;
        let end = 4;
        let getData = data.slice(0,4);
        getData.forEach(e =>{actionService.createCards(e)});
        this.displayCardColor();
        this.loadingButton.addEventListener("click",e=>{
            start = end;
            end += 4;
            getData = helperService.getRequiredData(data,start,end);
            getData.forEach(e =>{actionService.createCards(e)});
            this.displayCardColor();
            if(end >= data.length -1){
                this.loadingButton.style.display = 'none';
            }
            actionService.addLike();
        });
        actionService.addLike();
    },
    displayCardColor:()=>{
        for(let card of document.getElementsByClassName("card")){
            card.style.backgroundColor = actionService.cardBackgroundColor;
        }
    }
}

let actionService = {
    cardsLayout: document.querySelector(".cards-layout"),
    selectColumn: document.getElementById("numberOfColumns"),
    cardBeckgroundColor: document.getElementById("cardBackgroundColor"),
    cardSpace: document.getElementById("cardSpaceBetween"),
    themeRadioButtons: document.getElementsByName("theme"),
    filterBySourceRadioButtons: document.getElementsByName("filterBySource"),
    cardBackgroundColor:'',
    createCards:function ({image,caption,type,source_type,source_link,date,likes,name,profile_image}){
        this.cardsLayout.innerHTML += `
            <div class="card">
                <div class="card-header">
                    <div class="profile">
                        <div>
                            <img class="profile-image" src="${profile_image}" alt="profile image" />
                        </div>
                        <div class="profile-title">
                            <h5>${name}</h5>
                            <p>${new Date(date).toDateString()}</p>
                        </div>
                    </div>
                    <a href="${source_link}" target="_blank">
                        <img class="logo" src="../icons/${source_type}.svg" alt="${type} logo" />
                    </a>
                </div>
                <div class="card-body">
                    <img src="${image}" alt="main card image" />
                    <p>${caption}</p>
                </div>
                <hr />
                <div class="card-footer">
                    <button class="like-button" type="button">
                        <svg class="heart" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.7617 3.26543C14.3999 2.90347 13.9703 2.61634 13.4976 2.42045C13.0248 2.22455 12.518 2.12372 12.0063 2.12372C11.4945 2.12372 10.9878 2.22455 10.515 2.42045C10.0422 2.61634 9.61263 2.90347 9.25085 3.26543L8.50001 4.01626L7.74918 3.26543C7.0184 2.53465 6.02725 2.1241 4.99376 2.1241C3.96028 2.1241 2.96913 2.53465 2.23835 3.26543C1.50756 3.99621 1.09702 4.98736 1.09702 6.02084C1.09702 7.05433 1.50756 8.04548 2.23835 8.77626L2.98918 9.52709L8.50001 15.0379L14.0108 9.52709L14.7617 8.77626C15.1236 8.41448 15.4108 7.98492 15.6067 7.51214C15.8026 7.03935 15.9034 6.53261 15.9034 6.02084C15.9034 5.50908 15.8026 5.00233 15.6067 4.52955C15.4108 4.05677 15.1236 3.62721 14.7617 3.26543V3.26543Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <span class="like-number">${likes}</span>
                </div>
            </div>
        `;
    },
    updateCardColums: function(){
        this.selectColumn.addEventListener("change",e =>{
            console.log(e);
            console.log("selected value ", e.target.value)
            let cardLeyout = document.querySelector(".cards-layout");
                switch(e.target.value){
                    case "1":
                        cardLeyout.style = `grid-template-columns: 500px`;
                        break;
                    case "2":
                        cardLeyout.style = `grid-template-columns: 3fr 3fr`;
                        break;
                    case "3":
                        cardLeyout.style = `grid-template-columns: 2fr 2fr 2fr`;
                        break;
                    case "4":
                        cardLeyout.style = `grid-template-columns: 2fr 2fr 2fr 2fr`;
                        break;
                    case "5":
                        cardLeyout.style = `grid-template-columns: 1fr 1fr 1fr 1fr 1fr`;
                        break;
                    default:
                        cardLeyout.style = "grid-template-columns: 400px 400px";
                }
        })
    },
    updateCardBackgroundColor: function(){
        this.cardBeckgroundColor.addEventListener('input',e=>{
            const pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$";
            for(let card of document.getElementsByClassName("card")){
                if(e.currentTarget.value === pattern){ 
                    card.style.backgroundColor = '';
                }
                else{
                    card.style.backgroundColor = e.currentTarget.value;
                    this.cardBackgroundColor = e.currentTarget.value;
                }
            };
        });
    },
    updateSpaceBetweenCards:function(){
        this.cardSpace.addEventListener("input",e=>{
            document.querySelector(".cards-layout").style.gap = e.currentTarget.value;
        });
    },
    updateThemeBackgroundColor: function(){
        let leyoutPlaceholder = document.querySelector(".layout-placeholder");
        const blackAndWhite = ["#ffffff","#000000"];
        this.themeRadioButtons.forEach(element =>{
            element.addEventListener("change",e=>{
                if(e.target.checked && e.target.id === "darkTheme"){
                    leyoutPlaceholder.style.backgroundColor = blackAndWhite[1];
                    leyoutPlaceholder.style.color = blackAndWhite[0];
                }
                else{
                    leyoutPlaceholder.style.backgroundColor = blackAndWhite[0];
                    leyoutPlaceholder.style.color = blackAndWhite[1];
                }
            })
        })
    },
    addLike:()=>{
        document.querySelectorAll(".like-button").forEach((element,i)=>{
            element.addEventListener("click",e=>{
                let likeNumber = document.getElementsByClassName("like-number")[i];
                likeNumber.innerText += 1;
                let heart = document.querySelectorAll(".heart")[i];
                heart.style.fill = "red";
                e.currentTarget.disabled = true;
            });
        });
       
    }
}

let helperService = {
    getRequiredData:(data, start, end)=>{
        let tempData = [];        
        if(tempData.length < 4){
            end - tempData.length -1;
        }
        tempData = data.slice(start,end);
        return tempData;
    }
}

let startup = {
    init:()=>{
        loadDataService.getData();
        actionService.updateCardBackgroundColor();
        actionService.updateCardColums();
        actionService.updateSpaceBetweenCards();
        actionService.updateThemeBackgroundColor();
        
    }
}
startup.init();