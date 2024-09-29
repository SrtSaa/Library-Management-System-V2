const buyBookModal = {
    template: `
    <div>
        <div class="modal d-block" id="ratewindow" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header" style="background-color: #50c76c;">
                        <h1 class="modal-title fs-5">Purchase Book</h1>
                    </div>
                    <div class="modal-body" style="background-color: #f7e9f7;">
                        <div class="mx-auto" style="width: 300px;">
                            <div class="mb-3 row">
                                <label class="col-sm-3 col-form-label"><strong>Price</strong></label></label>
                                <div class="col-sm-7">
                                    <input type="text" readonly class="form-control-plaintext" value="₹ 100">
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label class="col-sm-3 col-form-label"><strong>UPI ID</strong></label>
                                <div class="col-sm-7">
                                    <input type="text" class="form-control" id="upiid" required>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label class="col-sm-3 col-form-label"><strong>OTP</strong></label>
                                <div class="col-sm-7">
                                    <input type="text" class="form-control" id="otp" required>
                                </div>
                            </div>
                        </div>
                        <div id="invalidDetails" class="d-flex justify-content-center"><b><span class="formerror text-danger"></span></b></div>
                        <div class='text-danger text-center my-4'><b>{{msg}}</b></div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" type="button" @click='closeModal'>Go Back</button>
                        <button class="btn btn-success" type="button" @click="purchase">Purchase</button>
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

        async purchase(){
            if (validatePurchaseDetails()){
                const res = await fetch(window.location.origin + '/purchaseBook', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authentication-Token': localStorage.getItem('auth-token')
                    },
                    body: JSON.stringify({
                        'username': localStorage.getItem('username'),
                        'book_id': this.bookID
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    this.$emit('close2');
                }
                else{
                    this.msg = "*" + data.message;
                }
            }
        }

    }

};



export default buyBookModal;