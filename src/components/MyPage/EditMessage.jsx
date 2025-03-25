import React, { useState } from 'react';
import { Routes, Route, useNavigate, useMatch } from 'react-router-dom';
import '/src/styles/MyPage/EditContact.css';
import check from '/assets/InfoPage/check-coral.svg';

const EditMessage = () => {
    const [contactInfo, setContactInfo] = useState('');
    const navigate = useNavigate();

    const handleContactChange = (e) => {
        setContactInfo(e.target.value);
    };

    const handleNext = () => {
        navigate('/mypage/myprofile', { state: { edited: true, what: 'message' } })
    }

    return (
        <div className="edit-section-container">
            <div className="edit-top-container">
                <div className="edit-top-title">
                    상대방에게 전달할 <br />
                    <span className="point-color">메시지</span>를 작성해주세요 (선택)
                </div>
                <div className="edit-top-sub-title">
                    <img src={check} className="edit-check" alt="확인" />
                    연락처와 함께 전달할 메시지입니다!
                </div>
            </div>

            <div className="edit-bottom-container">
                <textarea 
                    className="edit-contact-box"
                    value={contactInfo}
                    onChange={handleContactChange}
                    placeholder="메시지를 입력하세요 (최대 50글자)"
                    maxLength="50"
                />
                <div className="edit-contact-count">
                    {contactInfo.length}/50
                </div>
            </div>

            <div className="edit-contact-warning">
                <div className="edit-warning-big">
                    꼭 읽어주세요!
                </div>
                <div className="edit-warning-small">
                    <span>해당 메시지 작성은 선택 사항이며,</span><br />
                    <span>한 자(띄어쓰기 포함)이라도 입력 시 해당 메시지가 함께 전달되니</span><br />
                    <span>이점 유의해 작성해주세요!</span>
                </div>
            </div>
            <button
                className='edit-next-button active'
                onClick={handleNext}
            >
                완료
            </button>
        </div>
    );
};

export default EditMessage;
