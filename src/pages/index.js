import Head from 'next/head';
import meta from '../../meta.json';
import { useEffect, useState } from 'react';
import { Input, Text } from '@geist-ui/core';
import { Calendar, FrameAltEmpty, Search } from 'iconoir-react';
import PoweredBy from '@/components/poweredBy';
import moment from 'moment';
import SubscribeBtn from '@/components/subscribe';
let stopper = true;
export default function Home() {
    const [posts, setPosts] = useState([]);
    const [copyPosts, setCopyPosts] = useState([]);
    const [timer, setTimer] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            stopper = false;
            try {
                const res = await fetch(
                    process.env.NEXT_PUBLIC_TABLE_BACKEND_API,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { data } = await res.json();
                setPosts(data);
                setCopyPosts(data);
                setTimeout(() => {
                    stopper = true;
                }, 1000);
            } catch (error) {
                console.error(error);
            }
        };
        if (stopper) fetchData();
    }, []);

    const searchResult = (e) => {
        const { value } = e.target;

        if (value === '') {
            setPosts(copyPosts);
            return;
        }

        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_TABLE_BACKEND_API}/search?q=${value}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { hits } = await res.json();
                setPosts(hits);
                // handle success
            } catch (error) {
                console.error(error);
                // handle error
            }
        }, 500);

        setTimer(newTimer);
    };
    const playThisVideo = (v) => {
        setPlayingVideo(v);
    };
    return (
        <>
            <Head>
                <title>{meta.title.value}</title>
                <meta name="description" content={meta.description.value} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <PoweredBy />
                <div className="header">
                    <div className="search-input">
                        <Text h3 my={0}>
                            HN Resource Template
                        </Text>
                        <Text small type="secondary">
                            Don't miss latest resources shared on the internet.
                        </Text>
                        <SubscribeBtn />
                    </div>
                </div>
                <div className="main-container">
                    <br />
                    <Input
                        icon={<Search />}
                        placeholder="Advance search for good resources"
                        width="100%"
                        onChange={searchResult}
                        type="secondary"
                    />
                    <div className="hn-top">
                        {posts.map((post, key) => (
                            <div className="post-card" key={key}>
                                <div className="post-rank">
                                    <FrameAltEmpty />
                                    <span>{key + 1}</span>
                                </div>

                                <div className="post-content">
                                    <a
                                        href={post.url}
                                        target="_blank"
                                        className="post-title"
                                    >
                                        <Text h4 my={0}>
                                            {post.title}
                                        </Text>
                                        <Text small>{post.url}</Text>
                                    </a>
                                    <div className="post-numbers">
                                        <div className="post-details">
                                            <div className="options">
                                                <Calendar />
                                                <span>
                                                    {moment(
                                                        top.created_at
                                                    ).fromNow()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
