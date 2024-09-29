import adminNavbar from "../components/adminNavbar.js";



const DeleteSection = {
    template:`
    <div>
        <adminNavbar title="Delete Section"/>
        <div style="margin-top: 70px; margin-bottom: 20px;">
            <h1 class="h1 text-center">Delete Section</h1></br>
        </div>

        <div class="register-style">
            <div v-if="sections.length != 0">
                <div class="mb-3">
                    <label class="h5 form-label me-4">Title</label><div id="title" style='display: inline'><b><span class="formerror text-danger"></span></b></div>
                    <select class="form-select" aria-label="Default select example" v-model="selectedID">
                        <option value="-1" selected>Choose Section</option>
                        <option :value="section.id" v-for="section in sections">{{section.title}}</option>
                    </select>
                </div>
                
                <div class='text-danger text-center' mt-4><b>{{msg}}</b></div>
                <button class="d-grid col-5 mx-auto btn btn-primary mt-4" data-bs-target="#deleteModal" data-bs-toggle="modal">Delete Section</button>
            </div>
            <div class="modal fade" id="deleteModal" data-bs-backdrop="static" aria-hidden="true" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header" style="background-color: #50c76c;"><h1 class="modal-title fs-5">Confimation Message</h1></div>
                        <div class="modal-body" style="background-color: #f7e9f7;">
                            <div class="h5">Are you sure to delete this Section?</div>
                            <div class="h6">Reminder: This action will delete all the available eBooks under this section.</div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-success" data-bs-dismiss="modal">No</button>
                            <button class="btn btn-danger" @click="deletesection" data-bs-dismiss="modal">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    components: {
        adminNavbar
    },

    data() {
        return {
            sections: [],
            selectedID: -1,
            msg: null
        }
    },

    async mounted() {
        const res = await fetch('/api/Section', {
            headers: {
                'Authentication-Token': localStorage.getItem('auth-token'),
            },
        })
        if (res.ok) {
            this.sections = await res.json();
        }
    },

    methods: {
        async deletesection(){
            if (this.selectedID == -1){
                this.msg = "*Please Select a Section!";
            }
            else{
                const res = await fetch(window.location.origin + `/api/Section/${this.selectedID}`, {
                    method: 'DELETE',
                    headers: { 
                        'Authentication-Token': localStorage.getItem('auth-token')
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    var i = 0;
                    while (i < this.sections.length) {
                        if (this.sections[i].id === this.selectedID) {
                            this.sections.splice(i, 1);
                            this.selectedID = -1;
                            break
                        }
                        ++i;
                    }
                }
                this.msg = "*" + data.message;
            }
        }
    }

    
};



export default DeleteSection;