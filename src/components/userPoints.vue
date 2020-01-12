<template>
    <div id="notice-container">
        <Navbar></Navbar>
        <br/>

        <form>
            <u><h2 class="text-xs-center">Search and Edit User Details</h2></u>
            <label class="noticeLabel">Name: </label><v-text-field value="noticeName" required v-model="name" class="noticeText" placeholder="Enter name to get the details"/>

            <v-btn v-on:click="search" id="noticeButton" class="blue lighten-2 mt-5" dark large>Search</v-btn>
            <v-btn @click="showModal = true" id="noticeButton" class="blue lighten-2 mt-5" dark large>Edit</v-btn>            
            
            <b-modal @input ="showModal = true" @ok="editUserPoints" id="modal" centered title="Edit user details" v-model="showModal"  :no-close-on-backdrop="true"  :hide-header-close="true" :no-close-on-esc="true">
                <label class="noticeLabel2">Edit Name:</label><v-text-field value="noticeName" required v-model="this.name" class="noticeText2"/>
                <label class="noticeLabel2">Edit SAP:</label><v-text-field value="noticeName" required v-model="this.SAP" class="noticeText2"/>
                <label class="noticeLabel2">Edit Email:</label><v-text-field value="noticeName" required v-model="this.email" class="noticeText2"/>
                <label class="noticeLabel2">Edit Points:</label><v-text-field value="noticeName" required v-model="this.points" class="noticeText2"/>
                <b-form-checkbox style="margin-left: 30%;" id="checkbox-1" v-model="status" v-if="disabled_status === false" name="checkbox-1" value="checked" unchecked-value="unchecked">Delete CSI Membership?</b-form-checkbox>
            </b-modal>    
        </form>

        <div id="result-container">
            <div id="result">
                <h3 id="resultHeading">Data</h3>
                <br/>
                <p class="result-para">Name: {{this.name}}</p>
                <p class="result-para">UID: {{this.uid}}</p>
                <p class="result-para">SAP: {{this.SAP}}</p>                    
                <p class="result-para">CSI Member: {{this.csiMember}}</p>
                <p class="result-para">E-mail: {{this.email}}</p>                
                <p class="result-para">Points: {{this.points}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import bModal from 'bootstrap-vue/es/components/modal/modal';
import bFormCheckbox from 'bootstrap-vue/es/components/form-checkbox/form-checkbox';
import Navbar from './Navbar.vue';
import firebase from 'firebase';

export default {
    components: {
        'Navbar': Navbar,
        'b-modal': bModal,
        'b-form-checkbox': bFormCheckbox,   
    },

    beforeCreate(){
        var self = this;
        firebase.auth().onAuthStateChanged(function(user) {
            if(!user) 
                self.$router.push('/');       
        });
    },

    data() {
        return {
            name: '',
            SAP: '',
            csiMember: false,
            email: '',
            points: '',
            uid: '',
            showModal: false,
            status: "",
            disabled_status: true
        }
    },

    methods: {
        search() {
            var flag = 0;
            var self = this;
            var storeData = firebase.database().ref("userPoints");                    
            
            storeData.on("value", function(snapshot){
                snapshot.forEach(function(childSnapshot){                                          
                    var childData = childSnapshot.val();                    
                    var temp = childData.name;                    
                    if(temp.localeCompare(self.name) === 0) {
                        if(childSnapshot.hasChild("csiMember")) {
                            self.csiMember = true; 
                            self.disabled_status = false;
                        }                                                    
                        else {
                            self.csiMember = false;
                            self.disabled_status = true;
                        }

                        self.SAP = childData.SAP;
                        self.email = childData.email;
                        self.points = childData.points; 
                        self.uid = childSnapshot.key;
                        flag = 1;                       
                        return true;                       
                    }
                });
            });
            
            if(flag === 0) {
                alert('No users found.');
                self.SAP = "";
                self.email = "";
                self.points = 0;
                self.uid = "";
                self.csiMember = '';
            }
            
        },
        
        editUserPoints:function() {
            var self = this, check;           
            if(self.uid.localeCompare("") === 0) {                
                alert("No user data input found. Please search an existing user and then edit its details.");
                return;
            }

            //if non-existing member enters CSI member ID, it would automatically be rejected. 
            var data = firebase.database().ref("userPoints");
            console.log(self.status);
            /*data.on("value",function(snapshot){
                check = snapshot.child(self.uid+'/csiMember').exists(); //true if exists, false if it doesn't
            });           
            console.log("CSI member exists: "+check);        
            */
            
            if(self.status.localeCompare("checked") === 0) {
                //delete CSI memebership, override the details
                data.child(self.uid).set({
                    SAP: self.SAP,
                    email: self.email,
                    name: self.name,
                    points: self.points
                }).then(function(){
                    alert("Inserted!");                        
                    self.$router.push('Home');
                });                
            }
            else {
                //keep the CSI membership
                data.child(self.uid).set({
                    SAP: self.SAP,
                    csiMember: self.csiMember,
                    email: self.email,
                    name: self.name,
                    points: self.points,                    
                }).then(function(){
                    alert("Inserted!");
                    self.$router.push('Home');
                });                
            }
        }
    },
}
</script>

<style scoped>
#show-blogs{
max-width:800px;
margin: 0 auto;
}
.single-blog{
padding:20px;
margin:20px 0;
box-sizing: border-box;
background: #e1f5fe;

}
input[type="text"], textarea{
display: block;
width: 100%;
padding: 8px;
}

#modal{
    width: 60%;
}

#result{
  padding: 10px 20px;
  border: 1px dotted #ccc;
  margin:auto;
  display: inline-block;
  width: 50%;
}
#resultHeading{
  margin-top:10px;
  text-align: left;
}
#result-container{
  text-align: center;
}
.result-para{
  text-align: left;
  margin-top: 10px;
}
.noticeText{
display: block;
width: 50%;
padding: 6px;
margin-left:auto;
margin-right:auto;
margin-top:20px;
}
.noticeText2{
display: block;
width: 80%;
padding: 6px;
margin-left: auto;
margin-right: auto;
margin-top:20px;
}

.noticeLabel{
  display: block;
  margin: 20px 0 10px;
  text-align: left;
  width: 50%;
  padding: 6px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;

}
.noticeLabel2{
  display: block;
  margin: auto 0 auto;
  text-align: left;
  width: 80%;
  padding: 6px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;

}
#noticeButton{
  display: block;
  width: 28%;
  padding: 8px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
  margin-top: 30px;
}
#noticeHeading{
  display: block;
  width: 25%;
  padding: 8px;
  margin: auto;
  font-size: 18px;
}



#poll-block *{
box-sizing: border-box;
 }

#poll-block
{ margin: 20px auto;
max-width: 600px;
}

label{
display: block;
margin: 20px 0 10px;
}

input[type="text"] {
display: block;
width: 100%;
padding: 8px;
}

#preview{
padding: 10px 20px;
border: 1px dotted #ccc;
margin:30px 0;
}

h3
{
margin-top:10px;
}

</style>