const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(express.json());
app.use(express.static("public"));


const supabase = createClient(
  "https://vjdsituwfrxnaqoolpdq.supabase.co",
  "sb_publishable_u4G7ZfQP7JBtpkth_YscMg_5bqd1gSL"
);

async function saveUser(kakao_id){

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("kakao_id", kakao_id)
        .single();


    if(!data){

        await supabase
            .from("users")
            .insert([
                {
                    kakao_id:kakao_id
                }
            ]);

    }

}


app.get("/", (req,res)=>{
    res.send("Findoory Server Running");
});

app.post("/kakao", async(req,res)=>{

    const kakao_id = req.body.userRequest.user.id;
    const utterance = req.body.userRequest.utterance;

    await saveUser(kakao_id);

    if(utterance === "도감 얻기"){

    res.json({
        version:"2.0",
        template:{
            outputs:[
                {
                    simpleText:{
                        text:"도감 보기"
                    }
                },
                {
                    textCard:{
                        title:"도감을 확인해보세요.",
                        buttons:[
                            {
                                action:"webLink",
                                label:"도감 보기",
                                webLinkUrl:`https://findoory-server.onrender.com/collection.html?id=${encodeURIComponent(kakao_id)}`
                            }
                        ]
                    }
                }
            ]
        }
    });

}

    if(utterance === "도감에 넣기"){

    const today = new Date(Date.now() + 9 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);


    // 오늘 지급할 카드 찾기
    const { data: card } = await supabase
        .from("encyclopedia")
        .select("id")
        .eq("card_date", today)
        .single();


    if(!card){

        return res.json({
            version:"2.0",
            template:{
                outputs:[
                    {
                        simpleText:{
                            text:"오늘의 카드가 아직 준비되지 않았습니다."
                        }
                    }
                ]
            }
        });

    }


    // 이미 받은 카드인지 확인
    const { data: existing } = await supabase
        .from("user_cards")
        .select("*")
        .eq("kakao_id", kakao_id)
        .eq("card_id", card.id)
        .single();


    if(existing){

        return res.json({
            version:"2.0",
            template:{
                outputs:[
                    {
                        simpleText:{
                            text:"이미 도감에 보관한 카드입니다."
                        }
                    }
                ]
            }
        });

    }


    // 오늘 카드 지급
    const { error } = await supabase
        .from("user_cards")
        .insert([
            {
                kakao_id:kakao_id,
                card_id:card.id
            }
        ]);


    if(error){

        return res.json({
            version:"2.0",
            template:{
                outputs:[
                    {
                        simpleText:{
                            text:"카드 저장 중 오류가 발생했습니다."
                        }
                    }
                ]
            }
        });

    }


    return res.json({
        version:"2.0",
        template:{
            outputs:[
                {
                    simpleText:{
                        text:"오늘의 카드를 도감에 보관했습니다!"
                    }
                }
            ]
        }
    });

}
});



app.get("/test", async(req,res)=>{

    const { data, error } = await supabase
        .from("encyclopedia")
        .select("*");


    if(error){
        return res.send(error);
    }

    res.json(data);

});

app.post("/user", async(req,res)=>{

    const { kakao_id } = req.body;


    await saveUser(kakao_id);


    res.json({
        message:"User saved",
        kakao_id:kakao_id
    });

});

app.get("/user", async(req,res)=>{

    const kakao_id = "test123";

    await saveUser(kakao_id);

    res.send("User saved");
});

app.post("/reward", async(req,res)=>{

    const { kakao_id, card_id } = req.body;


    // 이미 가지고 있는 카드인지 확인
    const { data: existing } = await supabase
        .from("user_cards")
        .select("*")
        .eq("kakao_id", kakao_id)
        .eq("card_id", card_id)
        .single();


    if(existing){
        return res.json({
            message:"Already have this card"
        });
    }


    // 카드 지급
    const { data, error } = await supabase
        .from("user_cards")
        .insert([
            {
                kakao_id:kakao_id,
                card_id:card_id
            }
        ]);


    if(error){
        return res.send(error);
    }


    res.json({
        message:"Card rewarded",
        data:data
    });

});

app.get("/collection/:kakao_id", async(req,res)=>{

    const kakao_id = req.params.kakao_id;


    // 사용자가 가진 카드 찾기
    const { data: cards, error: cardError } = await supabase
        .from("user_cards")
        .select("card_id")
        .eq("kakao_id", kakao_id);


    if(cardError){
        return res.send(cardError);
    }


    const cardIds = cards.map(card => card.card_id);


    // 가진 카드 정보 가져오기
    const { data: encyclopedia, error } = await supabase
        .from("encyclopedia")
        .select("*")
        .in("id", cardIds);


    if(error){
        return res.send(error);
    }


    res.json(encyclopedia);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
});