const show = document.getElementById('show')
const title = document.getElementById('title')
const creater = document.getElementById('creater')

const urlParams = new URLSearchParams(window.location.search)
const db = urlParams.get('db')

show.onclick  = async(event) => {
    var fullUrl = window.location.origin + `/getlist?db=${db}`; 
    window.location.assign(fullUrl)
}

const getInfo = async()=>{
    try{
        const result = await axios.get(`/getinfo/${db}`)
        title.innerHTML+= result.data[0].title
        creater.innerHTML += result.data[0].name
    }catch(e){
        console.log(e);
    }
}

getInfo();