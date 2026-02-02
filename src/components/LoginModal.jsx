import { useState, useEffect, useRef } from "react"
import { supabase } from "../client.js"!

function LoginModal({ isOpen, onClose }) {
    const [emailValue, setEmailValue] = useState('')
    const [passValue, setPassValue] = useState('')
    if (!isOpen) return null;
    const handleLogin = async (e) => {
        e.preventDefault()
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: emailValue,
            password: passValue,
        })
    
        if (error) {
            alert("Ошибка входа: " + error.message)
            return 
        }
    
        setEmailValue('')
        setPassValue('')
        onClose() 
    }
    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    
                    <div className="modal-header">
                        <h5 className="modal-title">Log in</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    
                    <div className="modal-body">
                        <form action="" onSubmit={handleLogin}>
                            <div class="row mb-3">
                                <label for="colFormLabelLg" class="col-sm-2 col-form-label col-form-label-lg">Email</label>
                                <div class="col-sm-10">
                                    <input type="email" value={emailValue} 
                                    onChange={(e) => setEmailValue(e.target.value)}  class="form-control form-control-lg" id="colFormLabelLg" placeholder="example@exam.ple"/>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <label for="colFormLabelLg" class="col-sm-3 col-form-label col-form-label-lg">Password</label>
                                <div class="col-sm-9">
                                    <input type="password" value={passValue} 
                                    onChange={(e) => setPassValue(e.target.value)} class="form-control form-control-lg" id="colFormLabelLg" placeholder="password"/>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-outline-primary">Submit</button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default LoginModal