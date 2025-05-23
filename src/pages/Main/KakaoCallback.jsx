import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, replace } from 'react-router-dom';
import axios from 'axios';
import instance from '../../../axiosConfig';
import LoadingView from '../../components/LoadingView';

const KakaoCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URL;
    const [isRequested, setIsRequested] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        if (code && !isRequested) {
            console.log('Requesting access_token from Kakao with code:', code);
            setIsRequested(true);
            axios
                .post(
                    `https://kauth.kakao.com/oauth/token`,
                    `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
                    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                )
                .then((kakaoResponse) => {
                    const { access_token } = kakaoResponse.data;
                    console.log('Received access_token:', access_token);

                    axios
                        .post(`${BACKEND_URL}/v1/auth/login`, null, {
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': access_token, 
                            },
                        })
                        .then((backendResponse) => {
                            console.log('백엔드 응답', backendResponse.data.data);
                            const { accessToken, refreshToken } = backendResponse.data.data;
                            localStorage.setItem('jwtToken', accessToken);
                            localStorage.setItem('refreshToken', refreshToken);

                            const storedToken = localStorage.getItem('jwtToken');
                            console.log('Verified stored jwtToken:', storedToken);
                            const baseURL= import.meta.env.VITE_BACKEND_URL;
                            axios
                                .get(`${baseURL}/v1/users/me/nickname`,{
                                    headers:{
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${storedToken}`, // Authorization 헤더 추가
                                    }
                                })
                                .then((nicknameResponse) => {
                                    console.log("가져온 닉네임" , nicknameResponse.data.data)
                                    const nickname = nicknameResponse.data.data?.nickname;
                                    console.log("저장한 닉네임", nickname)
                                    navigate(nickname ? '/mainpage' : '/info',{replace: true});
                                })
                                .catch((error) => {
                                    console.error('[Nickname API Error] GET /v1/users/me/nickname:', {
                                        status: error.response?.status,
                                        data: error.response?.data,
                                        message: error.message,
                                        code:error.code,
                                    });
                                    navigate('/info',{replace:true});
                                });
                        })
                        .catch((error) => {
                            console.error('[Login API Error] POST /v1/auth/login:', {
                                status: error.response?.status,
                                data: error.response?.data,
                                message: error.message,
                            });
                            navigate('/');
                        });
                })
                .catch((error) => {
                    console.error('[Kakao OAuth API Error] POST kauth.kakao.com/oauth/token:', {
                        status: error.response?.status,
                        data: error.response?.data,
                        message: error.message,
                    });
                    navigate('/');
                });
        }
    }, [location.search, navigate]);

    return <LoadingView/>;
};

export default KakaoCallback;