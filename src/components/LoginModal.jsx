import { useState, useEffect, useRef } from "react"
import { supabase } from "../client.js" // Не забудь импортировать supabase!

function LoginModal({ isOpen, onClose }) {
    const [emailValue, setEmailValue] = useState('')
    const [passValue, setPassValue] = useState('')
    // 1. Сначала проверка: если закрыто — возвращаем null (сразу выходим)
    if (!isOpen) return null;
    const handleLogin = async (e) => {
        e.preventDefault()
        
        // 1. Делаем запрос
        const { data, error } = await supabase.auth.signInWithPassword({
            email: emailValue,
            password: passValue,
        })
    
        // 2. ПРОВЕРЯЕМ РЕЗУЛЬТАТ
        if (error) {
            // Если есть ошибка - показываем её и ОСТАНАВЛИВАЕМСЯ
            alert("Ошибка входа: " + error.message)
            return 
        }
    
        // 3. Если ошибки нет (код дошел сюда) - значит успех
        setEmailValue('')
        setPassValue('')
        onClose() 
    }
    // 2. Если открыто — возвращаем верстку. ОБЯЗАТЕЛЬНО слово return!
    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            {/* Добавляем dialog и content, чтобы это выглядело как окошко, а не текст на весь экран */}
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