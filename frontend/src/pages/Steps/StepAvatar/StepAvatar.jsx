import React, { useEffect, useState } from 'react';
import Card from '../../../components/shared/card/Card';
import Button from '../../../components/shared/button/Button';
import styles from './StepAvatar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { activate } from '../../../http';
import { setAuth } from '../../../store/authSlice';
import Loader from '../../../components/shared/Loader/Loader';

const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const { name, avatar } = useSelector((state) => state.activate);
    const [image, setImage] = useState('/images/monkey-avatar.png');
    const [loading, setLoading] = useState(false)
    const [unMounted, setUnmounted] = useState(false)
    function captureImage(e) {
        const file = e.target.files[0];
        //converting into base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result);
            dispatch(setAvatar(reader.result));
        };
    }
    const submit = async () => {
        if(!name || !avatar) return
        try {
            setLoading(true)
            const { data } = await activate({ name, avatar });
            if (data.auth) {
                if(!unMounted){

                    dispatch(setAuth(data));
                }
            }
            
            // console.log(data);
            onNext()
        } catch (err) {
            console.log(err);
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => {
            
            setUnmounted(true)
        }
    },[])
    if(loading) return <Loader message="Activation in Progress..."/>
    return (
        <>
            <Card title={`Okay, ${name}`} icon="monkey-emoji">
                <p className={styles.subHeading}>How’s this photo?</p>
                <div className={styles.avatarWrapper}>
                    <img
                        className={styles.avatarImage}
                        src={image}
                        alt="avatar"
                    />
                </div>
                <div>
                    <input
                        onChange={captureImage}
                        id="avatarInput"
                        type="file"
                        className={styles.avatarInput}
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Choose a different photo
                    </label>
                </div>
                <div>
                    <Button onClick={submit} text="Next" />
                </div>
            </Card>
        </>
    );
};

export default StepAvatar;