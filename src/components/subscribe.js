import { Button, Input, Modal, Text, useToasts } from '@geist-ui/core';
import { SendMail } from 'iconoir-react';

const { useState } = require('react');

const SubscribeBtn = () => {
    const { setToast } = useToasts({ placement: 'topRight' });
    const [state, setState] = useState(false);
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const handler = () => setState(true);
    const closeHandler = (event) => {
        setState(false);
        console.log('closed');
    };
    const subscribeNow = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                process.env.NEXT_PUBLIC_TABLE_BACKEND_SUBSCRIBE_API,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([
                        { first_name: firstName, email_address: emailAddress },
                    ]),
                }
            );
            const { insertedCount } = await res.json();
            console.log(insertedCount);
            if (insertedCount) {
                setToast({
                    text: 'Successfully subscribe',
                    delay: 2000,
                });
            }
            setLoading(false);
            // handle success
        } catch (error) {
            console.error(error);
            setLoading(false);
            // handle error
        }
    };
    return (
        <div>
            <br />
            <Button
                auto
                onClick={handler}
                scale={2 / 3}
                type="secondary"
                icon={<SendMail />}
            >
                Subscribe for weekly newsletter
            </Button>
            <Modal visible={state} onClose={closeHandler}>
                <Text h4>Weekly newsletter subscription for free</Text>
                <Modal.Content>
                    <Input
                        initialValue={firstName}
                        placeholder="First Name"
                        width="100%"
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <br />
                    <br />
                    <Input
                        initialValue={emailAddress}
                        placeholder="Your Email Address"
                        width="100%"
                        onChange={(e) => setEmailAddress(e.target.value)}
                    />
                    <br />
                    <br />
                    <Button
                        disabled={
                            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)
                        }
                        type="secondary"
                        loading={loading}
                        icon={<SendMail />}
                        width="100%"
                        onClick={subscribeNow}
                    >
                        Subscribe
                    </Button>
                </Modal.Content>
            </Modal>
        </div>
    );
};

export default SubscribeBtn;
