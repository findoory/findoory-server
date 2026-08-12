fetch("/collection/test123")

.then(res=>res.json())

.then(cards=>{


    const area =
    document.getElementById("collection");


    cards.forEach(card=>{


        area.innerHTML += `

        <div class="card">

            <img src="${card.image_url}">

            <div class="card-title">

                <span>
                ✨ 의뢰 해결 완료
                </span>

                <h2>
                 ${card.name}
                </h2>

        </div>


        <p class="quest">
        2026년 7월 28일 컬렉션
        </p>


        <p class="description">
        ${card.description}
        </p>


        </div>

        `;


    });


});