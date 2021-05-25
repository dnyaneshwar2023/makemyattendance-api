
const list = document.getElementById('list')
const urlParams = new URLSearchParams(window.location.search)
const db = urlParams.get('db')

const getData = async()=>{
    const result = await axios.get(`/get/${db}`);
    for(element in result.data)
    {
        list.innerHTML += result.data[element].prn + "<br>";
    }
}

getData()