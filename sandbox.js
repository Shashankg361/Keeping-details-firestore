const List = document.querySelector('.DatabaseDets');
const form = document.querySelector('.form');
const notify = document.querySelector('.notify');
const ack = document.querySelector('.confirmation');
var Username,UserId;
let d = new Date();

// Initial page loading with firestore database
readDatabase();

// Accepting the data from the user
form.addEventListener('submit',UserData);
readDatabase();
function UserData(e){
    e.preventDefault();

    const Userdets = {
        Name : form.username.value.trim(),
        Id : form.userId.value.trim(),
        JoiningDate : firebase.firestore.Timestamp.fromDate(d)
    }
    
    if(Userdets.Name != '' && Userdets.Id != ''){
        notify.style.display = 'none';
        writeDatabase(Userdets);
        form.reset();
        
    }else{
        notify.style.display = 'block';
    }
    
}
let HTML = '';
// to get Data from the database 
function readDatabase(){
        db.collection('UserDets').get().then((sanpshot)=>{
        //Data of the database
        //console.log(sanpshot.docs[0].data());
        sanpshot.docs.forEach(sanpshot => {
            //console.log(sanpshot.data());
            //console.log(sanpshot.data().Name);
            HTML+= `
            <li Data-id="${sanpshot.id}">
            <span style="font-weight:bold; font-size:20px">ID :-</span> ${sanpshot.data().Id}<br>
            <span style="font-weight:bold; font-size:20px">Name :-</span> ${sanpshot.data().Name}<br>
            <span style="font-weight:bold; font-size:20px">Date of joining :-</span> ${sanpshot.data().JoiningDate.toDate()}<br>
            <button class="del">Delete</button>
            </li>`
            /*let d = new Date(sanpshot.data().JoiningDate.toDate());
            console.log(d);*/
            
        });
        List.innerHTML = HTML;
        HTML ='';

    }).catch(err=>{
        console.log(err)
    });
}


//to save the data to database
function writeDatabase(Userdets){
    db.collection('UserDets').add(Userdets).then((ackn)=>{
        ack.innerHTML='Your ID is been succesfully Saved';
        ack.style.display = 'block';
        changingStyle(ack);
        getRecentData(ackn.id);
    }).catch(err=>{
        console.log(err);
    })
}

// TO delete the data from Database
List.addEventListener('click',deleteData);

function deleteData(e){
    if(e.target.classList.contains('del')){
        const Id = e.target.parentElement.getAttribute('Data-id');
        db.collection('UserDets').doc(Id).delete().then(()=>{
            console.log('Item Deleted');
            ack.innerHTML='Your ID is been succesfully Deleted';
            ack.style.display='block';
            scrollToTop();
            changingStyle(ack);
            e.target.parentElement.remove();
        }).catch(err=>{
            console.log(err);
        });
    }
}

// Setting intervals
function changingStyle(sanpshotAccess){
    setInterval(() => {
        sanpshotAccess.style.display = 'none';
    }, 10000);
}

// Scroll TO top
function scrollToTop(){
    scrollTo(0,0);
}

let html = '';
// Function to get a data of which id is provided
function getRecentData(id){
    db.collection('UserDets').doc(id).get().then((sanpshot)=>{
            html= `
            <li Data-id="${sanpshot.id}">
            <span style="font-weight:bold; font-size:20px">ID :-</span> ${sanpshot.data().Id}<br>
            <span style="font-weight:bold; font-size:20px">Name :-</span> ${sanpshot.data().Name}<br>
            <span style="font-weight:bold; font-size:20px">Date of joining :-</span> ${sanpshot.data().JoiningDate.toDate()}<br>
            <button class="del">Delete</button>
            </li>`
        List.innerHTML += html;
    }).catch(err=>{
        console.log(err);
    })
}






