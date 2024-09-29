const bookRequestModal = {
    template: `
    <div>
        <div class="modal d-block" id="ratewindow" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background-color: #50c76c;">
                        <h1 class="modal-title fs-5">Request Book</h1>
                    </div>
                    <div class="modal-body" style="background-color: #f7e9f7;">
                        <div class="mb-3">
                            <label class="form-label"><strong>No. of days you are requesting for</strong></label>
                            <input type="number" id="numdays" min="1" class="form-control" required>
                        </div>
                        <div id="wrongdays" style='display: inline'><b><span class="formerror text-danger"></span></b></div>
                        <div class='text-danger text-center my-4'><b>{{msg}}</b></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" type="button" @click='closeModal'>Go Back</button>
                        <button class="btn btn-success" type="button" @click="requestSubmit">Submit Request</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    

    props: {
        bookID: {
            type: Number,
            required: true
        }
    },

    data() {
        return {
            msg: null
        }
    },

    methods: {
        closeModal() {
            this.$emit('close1');
        },

        async requestSubmit(){
            clearErrors();
            const days = document.getElementById('numdays').value;
            if (days<=0){
                seterror('wrongdays', '*Days should be greater than 0');
            }
            else {
                const res = await fetch(window.location.origin + '/request-book', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: JSON.stringify({
                        'type': 'put_data',
                        'username': localStorage.getItem('username'),
                        'book_id': this.bookID,
                        'days': Number(days)
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    this.$emit('close2', { bookID: this.bookID });
                }
                else{
                    this.msg = "*" + data.message;
                }
            }
        },
    }


};



export default bookRequestModal;