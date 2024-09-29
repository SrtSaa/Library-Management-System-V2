import adminNavbar from "../components/adminNavbar.js";



const AddSection = {
    template:`
    <div>
        <adminNavbar title="Add Section"/>
        <div style="margin-top: 70px; margin-bottom: 20px;">
            <h1 class="h1 text-center">Add Section</h1></br>
        </div>

        <div class="register-style">
            <div class="mb-3">
                <label class="h5 form-label me-4">Title</label><div id="title" style='display: inline'><b><span class="formerror text-danger"></span></b></div>
                <input type="text" id="ftitle" class="form-control" placeholder="Title of the Section" v-model="section_details.title">
            </div>
            
            <div class="my-3">
                <label class="h5 form-label">Description</label>
                <textarea class="form-control" rows="3" v-model="section_details.description"></textarea>
            </div>
            
            <div class='text-danger text-center my-4'><b>{{msg}}</b></div>
            <button class="d-grid col-5 mx-auto btn btn-primary mt-4" @click='addsection'>Add Section</button>
        </div>
    </div>
    `,

    components: {
        adminNavbar
    },

    data() {
        return {
            section_details: {
                title: null,
                description: null
            },
            msg: null
        }
    },

    methods: {
        async addsection(){
            if (validateSectionTitle()){
                this.section_details['title'] = this.section_details['title'].trim();
                if (this.section_details['description'])
                    this.section_details['description'] = this.section_details['description'].trim();

                const res = await fetch(window.location.origin + '/api/Section', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: JSON.stringify(this.section_details),
                });
                const data = await res.json();
                if (res.ok) {
                    this.section_details['title'] = null;
                    this.section_details['description'] = null;
                }
                this.msg = "*" + data.message;
            }
        }
    }
};



export default AddSection;