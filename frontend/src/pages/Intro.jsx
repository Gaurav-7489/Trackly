import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";

export default function Intro() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("trackly_intro_seen")) {
            navigate("/login");
        }
    }, [navigate]);

    const enter = () => {
        localStorage.setItem("trackly_intro_seen", "true");
        navigate("/login");
    };

    return (
        <div className="intro-page">
            <div className="intro-hero">
                <h1 className="logo">Trackly</h1>

                <h2 className="headline"> A Student Productivity Dashboard</h2>

                <div className="feature-row">
                    <span>Progress Analytics</span>
                    <span>Weekly Task System</span>
                    <span>Focus & Study Tools</span>
                    <span>Auth & Cloud Data</span>
                </div>

                <p className="description">
                    Trackly is a full-stack productivity dashboard engineered around real student workflows — not a demo, not a mock UI.

                    Built with production standards: secure authentication, cloud persistence, real data constraints, and synced sessions across devices.
                </p>

                <div className="actions">
                    <button className="primary" onClick={enter}>
                        Get Started
                    </button>
                    <button
                        className="secondary"
                        onClick={() =>
                            window.open(
                                "https://www.linkedin.com/posts/YOUR_POST_LINK",
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        Learn More · LinkedIn
                    </button>

                </div>
            </div>
        </div>
    );
}
