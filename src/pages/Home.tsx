import styled, { keyframes } from "styled-components";
import { AnimationOnScroll } from "react-animation-on-scroll";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

//animation frames
const BottomJumpKeyFrame = (lower: number, high: number) => keyframes`
0%   { bottom: ${lower}px; }
100% { bottom: ${high}px; }
`;

const TopJumpKeyFrame = (lower: number, high: number) => keyframes`
0%   { top: ${high}px; }
100% { top: ${lower}px; }
`;

const BorderKeyFrame = (length: number, width: number) => keyframes`
  0% {clip: rect(0px, 0px, 800px, -${length}px); }
  100% {clip: rect(0px, ${width + length}px, 800px, ${width}px); }
`;

const ShadowKeyFrame = keyframes`
  0% { box-shadow: 0px 0px 0px 0px red; }
  100% { box-shadow: 0px 0px 80px 12px red; }
`;

const FlyKeyFrame = keyframes`
  0% {transform: matrix(0.43, 0.81, -1.09, 0.19, 0, 0);}
  100% {transform: matrix(0.43, 0.81, -1.09, 0.29, 0, 0);}
`;

const BackManKeyFrame = keyframes`
  0% {bottom: -100px; opacity: 0.3; }
  10% {bottom: -100px; opacity: 0.8; }
  20% {bottom: -100px; opacity: 0.3; }
  30% {bottom: -100px; opacity: 0.8; }
  50% {bottom: -150px; opacity: 0.8; }
  60% {bottom: -120px; opacity: 0.8; }
  70% {bottom: -150px; opacity: 0.8; }
  80% {bottom: -120px; opacity: 0.8; }
  90% {bottom: -150px; opacity: 0.8; }
  100% {bottom: -150px; opacity: 0.1; }
`;

const CarouselKeyFrame = keyframes`
  0% {margin-left: 0px}
  100% {margin-left: -1500px}
`;

const BackLetterKeyFrame = keyframes`
  0% {margin-left: -50px}
  100% {margin-left: -200%}
`;

const RoadmapKeyFrame = (width: number, height: number) => keyframes`
  0% {clip: rect(0px, ${width}px, 0px, 0px)}
  100% {clip: rect(0px, ${width}px, ${height}px, 0px)}
`;

const JumpManKeyFrame = (height: number) => keyframes`
  0% {transform: translate(0px, ${-height / 2}px)}
  100% {transform: translate(0px, ${height / 2}px)}
`;

// components
const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: url("/assets/image/home-back1.png");
  background-size: 100% 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 150px;
  padding-bottom: 100px;
  box-sizing: border-box;
  @media only screen and (max-width: 900px) {
    height: 800px;
    background-size: 100% 800px;
  }
  @media only screen and (max-width: 500px) {
    height: 1000px;
    background-size: 100% 1000px;
  }
`;

const TitlePart = styled.div`
  width: 50%;
  margin: 0px;
  margin-left: 200px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex-grow: 1;

  font-family: "Londrina Solid";
  font-style: normal;

  color: #ffffff;
  font-weight: 400;
  text-transform: uppercase;

  h5 {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;

    text-transform: uppercase;
    margin: 0px;
  }
  h1 {
    font-size: 60px;
    line-height: 68px;
    letter-spacing: 2px;
    margin: 10px 0px;
  }
  p {
    font-weight: 300;
    font-size: 12px;
    line-height: 26px;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 0px;
  }
  @media only screen and (max-width: 1366px) {
    margin-left: 170px;
    h5 {
      font-size: 16px;
    }
    h1 {
      font-size: 40px;
      line-height: 48px;
    }
    p {
      font-size: 12px;
    }
  }
  @media only screen and (max-width: 1100px) {
    margin-left: 130px;
  }

  @media only screen and (max-width: 970px) {
    margin-left: 110px;
    h5 {
      font-size: 16px;
    }
    h1 {
      font-size: 36px;
      line-height: 44px;
    }
    p {
      font-size: 12px;
    }
  }
  @media only screen and (max-width: 900px) {
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    align-items: center;
    text-align: center;
    margin-bottom: 230px;
  }

  @media only screen and (max-width: 700px) {
    margin-bottom: 300px;
  }

  @media only screen and (max-width: 420px) {
    h5 {
      font-size: 12px;
    }
    h1 {
      font-size: 28px;
      line-height: 44px;
    }
    p {
      font-size: 8px;
    }
  }
`;

const ConnectButton = styled.div`
  margin-top: 10px;
  margin-bottom: 5px;
  padding: 20px 50px;
  background: url("/assets/image/redbtn-back.png");
  background-size: 100% 65px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  box-shadow: none;
  &:hover {
    background-color: transparent;
    cursor: pointer;
    box-shadow: none;
  }
`;

const BBButton = styled.div`
  position: absolute;
  box-sizing: border-box;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: transparent;
  color: rgba(white, 0.7);
  box-shadow: inset 0 0 0 1px rgba(white, 0.5);

  &::after {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    margin: -1px;
    box-shadow: inset 0 0 0 2px;
    animation: ${BorderKeyFrame(20, 150)} 2s ease-in-out infinite alternate;
    border-radius: 5px;
  }
`;

const RedSpane = styled.span`
  color: red;
`;

const HomeMan = styled.img`
  position: absolute;
  width: 400px;
  right: 95px;
  animation: ${BottomJumpKeyFrame(10, 40)} 1s ease-in-out infinite alternate;

  @media only screen and (max-width: 1366px) {
    width: 350px;
    right: 80px;
  }

  @media only screen and (max-width: 1100px) {
    width: 300px;
    right: 70px;
  }

  @media only screen and (max-width: 900px) {
    animation: ${BottomJumpKeyFrame(-180, -150)} 1s ease-in-out infinite
      alternate;
  }
  @media only screen and (max-width: 500px) {
    animation: ${BottomJumpKeyFrame(-330, -300)} 1s ease-in-out infinite
      alternate;
  }
  @media only screen and (max-width: 380px) {
    width: 80%;
    left: 50%;
    transform: translate(-50%, 0px);
  }
`;

const AboutContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Londrina Solid";
  font-style: normal;
  text-align: center;
  color: white;
  padding: 40px 0px;
  position: relative;
  background-color: transparent;
  h5 {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;

    text-transform: uppercase;
    margin: 0px;
  }
  h1 {
    font-size: 60px;
    line-height: 68px;
    letter-spacing: 2px;
    margin: 10px 0px;
  }
  p {
    font-weight: 300;
    font-size: 12px;
    line-height: 26px;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 0px;
    width: 40%;
  }
`;

const BB = styled.div`
  position: absolute;
  box-sizing: border-box;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: transparent;
  color: rgba(white, 0.7);
  box-shadow: inset 0 0 0 1px rgba(white, 0.5);

  &::after {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    margin: -2px;
    box-shadow: inset 0 0 0 2px;
    animation: ${BorderKeyFrame(100, 900)} 2s ease-in-out infinite alternate;
    border-radius: 150px;
  }
`;

const AboutBox = styled.div`
  box-sizing: border-box;
  margin: 100px auto;
  width: 850px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 150px;
  padding: 40px 100px 40px 300px;
  border: 1px solid #ff3838;
  position: relative;
  background-color: transparent;
  animation: ${ShadowKeyFrame} 2s ease-in-out infinite alternate;

  h4 {
    font-size: 24px;
    line-height: 40px;
    letter-spacing: 1px;
    text-transform: uppercase;

    color: #ff3232;
    margin: 0px;
  }
  p {
    font-weight: 300;
    font-size: 12px;
    line-height: 20px;
    /* or 153% */

    letter-spacing: 1px;
    text-transform: capitalize;
    text-align: left;
    width: 100%;
    margin: 0px;
  }
  @media only screen and (max-width: 900px) {
    padding: 200px 100px 40px 100px;
    align-items: center;
    width: 90%;
    margin-top: 200px;
    h4,
    p {
      text-align: center;
    }
  }

  @media only screen and (max-width: 530px) {
    padding-left: 50px;
    padding-right: 50px;
  }

  @media only screen and (max-width: 320px) {
    padding-top: 100px;
  }
`;

const FlyPane = styled.div`
  box-sizing: border-box;

  position: absolute;
  width: 320px;
  height: 230px;
  bottom: 20px;
  left: -60px;

  background: #d62d3a;
  border-radius: 90px;
  animation: ${FlyKeyFrame} 2s ease-in-out infinite alternate;
  @media only screen and (max-width: 900px) {
    top: -100px;
    left: 20%;
  }
  @media only screen and (max-width: 600px) {
    left: 10%;
  }
  @media only screen and (max-width: 420px) {
    left: 0px;
    width: 70vw;
    height: 50vw;
  }
`;

const AboutUsMan = styled.img`
  position: absolute;
  width: 350px;
  left: -40px;
  animation: ${BottomJumpKeyFrame(17, 50)} 2s ease-in-out infinite alternate;
  @media only screen and (max-width: 900px) {
    left: 50%;
    transform: translate(-50%, -50%);
    animation: ${TopJumpKeyFrame(-70, -40)} 2s ease-in-out infinite alternate;
  }
  @media only screen and (max-width: 420px) {
    width: 80vw;
  }
`;

const BackMan1 = styled.img`
  width: 300px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0px);
  animation: ${BackManKeyFrame} 5s linear infinite;
  z-index: 0;
  @media only screen and (max-width: 380px) {
    width: 240px;
  }
`;

const TrendingContainer = styled.div`
  width: 100%;
  background-color: transparent;
  background-image: url("/assets/image/home-back2.png");
  background-size: 100% 100%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding-top: 250px;

  h5 {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;

    text-transform: uppercase;
    margin: 0px;
  }
  h1 {
    font-size: 60px;
    line-height: 68px;
    letter-spacing: 2px;
    margin: 10px 0px;
    text-transform: uppercase;
    text-align: center;
  }
  p {
    font-weight: 300;
    font-size: 12px;
    line-height: 26px;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 0px;
    width: 40%;
    text-align: center;
  }

  @media only screen and (max-width: 900px) {
    h1 {
      font-size: 48px;
      line-height: 52px;
    }
    p {
      width: 80%;
    }
  }

  @media only screen and (max-width: 520px) {
    h1 {
      font-size: 44px;
      line-height: 48px;
    }
    p {
      width: 90%;
    }
  }

  @media only screen and (max-width: 420px) {
    h1 {
      font-size: 40px;
      line-height: 44px;
    }
    p {
      width: 90%;
    }
  }
`;

const CarouselItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  img {
    width: 150px;
    height: 150px;
    padding: 20px 10px;
    border-radius: 300px;
    background-color: white;
    box-shadow: 0px 20px black;
    margin-bottom: 20px;
    position: relative;
  }
  h4 {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;

    text-transform: uppercase;
    margin: 0px;
  }
`;

const CarouselView = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin: 50px 0px;
`;

const CarouselPane = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  animation: ${CarouselKeyFrame} 2s ease-in-out infinite alternate;

  & > * {
    margin-right: 50px;
  }
`;

const RoadmapContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  text-align: center;
  padding-top: 200px;
  position: relative;
  overflow: hidden;

  h5 {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;

    text-transform: uppercase;
    margin: 0px;
  }
  h1 {
    font-size: 60px;
    line-height: 68px;
    letter-spacing: 2px;
    margin: 10px 0px;
    text-transform: uppercase;
  }
  p {
    font-weight: 300;
    font-size: 12px;
    line-height: 26px;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 0px;
    width: 60%;
    text-align: center;
  }

  @media only screen and (max-width: 520px) {
    h1 {
      font-size: 44px;
      line-height: 48px;
    }
    p {
      width: 90%;
    }
  }
`;

const Roadmap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 100px 0px 150px 0px;
  box-sizing: border-box;
  width: 80%;
  height: 1500px;
  background: url("/assets/image/roadmap-line-gray.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  margin-top: 50px;
  position: relative;
  @media only screen and (max-width: 1366px) {
    width: 90%;
  }
  @media only screen and (max-width: 900px) {
    background-image: none;
    padding-top: 0px;
    height: auto;
  }
`;

const RoadmapBackLine = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  background-image: url("/assets/image/roadmap-line.png");
  background-size: 100% 1500px;
  background-repeat: no-repeat;
  animation: ${RoadmapKeyFrame(2000, 1500)} 20s ease-in-out;
  z-index: 0;
  @media only screen and (max-width: 900px) {
    display: none;
  }
`;

interface RoadmapItemProps {
  float: string;
  margin: number;
  trans: number;
}

const RoadmapItem = styled.div<RoadmapItemProps>`
  width: ${(props: RoadmapItemProps) => `calc(100% - ${props.margin}%)`};
  display: flex;
  flex-direction: ${(props: RoadmapItemProps) =>
    props.float === "left" ? "row" : "row-reverse"};
  align-items: center;
  font-family: "Londrina Solid";
  font-style: normal;
  color: white;
  z-index: 1;

  margin-left: ${(props: RoadmapItemProps) =>
    props.float === "left" ? `${props.margin}%` : "auto"};
  margin-right: ${(props: RoadmapItemProps) =>
    props.float === "right" ? `${props.margin}%` : "auto"};
  transform: ${(props: RoadmapItemProps) => `translate(0px, ${props.trans}px)`};

  position: relative;

  h1 {
    font-weight: 400;
    font-size: 110px;
    line-height: 88px;
    /* identical to box height, or 80% */

    letter-spacing: 1px;
    text-transform: uppercase;
    margin: 20px 40px;
  }
  div {
    display: flex;
    flex-direction: column;
    align-items: ${(props: RoadmapItemProps) =>
      props.float === "left" ? "flex-start" : "flex-end"};

    h4 {
      font-weight: 400;
      font-size: 30px;
      line-height: 162.3%;

      text-align: right;
      letter-spacing: 0.03em;
      text-transform: capitalize;
      margin: 10px 0px;
    }
    p {
      font-weight: 300;
      font-size: 17px;
      line-height: 26px;

      text-align: ${(props: RoadmapItemProps) =>
        props.float === "left" ? "left" : "right"};
      letter-spacing: 1px;
      text-transform: capitalize;
      width: auto;
    }
  }

  &::before {
    position: absolute;
    transform: ${(props: RoadmapItemProps) =>
      props.float === "left" ? "translate(-50%, 0px)" : "translate(50%, 0px)"};
    content: ${(props: RoadmapItemProps) =>
      props.float === "left"
        ? 'url("/assets/image/location-left.png")'
        : 'url("/assets/image/location-right.png")'};
    left: ${(props: RoadmapItemProps) =>
      props.float === "left" ? "0px" : "auto"};
    right: ${(props: RoadmapItemProps) =>
      props.float === "right" ? "0px" : "auto"};
  }

  @media only screen and (max-width: 1100px) {
    div {
      h4 {
        margin-top: 0px;
      }
      p {
        font-size: 12px;
      }
    }
  }

  @media only screen and (max-width: 900px) {
    width: 80%;
    margin: 30px auto;
    flex-direction: column;
    align-items: center;
    div {
      align-items: center;
      h4 {
        text-align: center;
      }
      p {
        text-align: center;
      }
    }
    &::before {
      display: none;
    }
  }
`;

const BackMan2 = styled.img`
  width: 300px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0px);
  top: 10px;
  z-index: 0;
  @media only screen and (max-width: 380px) {
    width: 240px;
  }
`;

const BackLetterView = styled.div`
  width: 150%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50px) rotate(-30deg);
  overflow: hidden;
  z-index: 0;
`;

const BackLetterPane = styled.div`
  width: 1000%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  text-overflow: hidden;
  animation: ${BackLetterKeyFrame} 2s ease-in-out infinite alternate;
  font-family: "Londrina Solid";
  font-style: normal;
  font-weight: 900;
  font-size: 460px;
  line-height: 500px;
  /* identical to box height, or 19% */

  letter-spacing: 1px;
  text-transform: uppercase;
  color: gray;

  opacity: 0.21;

  @media only screen and (max-width: 900px) {
    font-size: 260px;
    line-height: 300px;
  }
`;

const FAQContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  text-align: center;
  background-image: url("/assets/image/home-back3.png");
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: 100% 100%;
  padding: 100px 0px;

  h5 {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;

    text-transform: uppercase;
    margin: 0px;
  }
  h1 {
    font-size: 60px;
    line-height: 68px;
    letter-spacing: 2px;
    margin: 10px 0px;
    text-transform: uppercase;
  }
  p {
    font-weight: 300;
    font-size: 12px;
    line-height: 26px;
    letter-spacing: 1px;
    text-transform: capitalize;
    margin: 0px;
    width: 60%;
    text-align: center;
  }

  @media only screen and (max-width: 520px) {
    h1 {
      font-size: 44px;
      line-height: 48px;
    }
    p {
      width: 90%;
    }
  }
`;

const FAQList = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  text-align: left;
  * {
    margin-top: 30px;
  }
  &:first {
    margin-top: 0px;
  }
`;

const ClosedFAQ = styled.div`
  width: 100%;
  background: #141414;
  border-radius: 18px;
  padding: 20px 50px;
  box-sizing: border-box;

  h3 {
    font-family: "Londrina Solid";
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 32px;
    /* identical to box height */

    letter-spacing: 0.03em;
    text-transform: capitalize;

    color: #ffffff;
  }

  &:hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 1100px) {
    h3 {
      font-size: 28px;
    }
  }

  @media only screen and (max-width: 420px) {
    padding: 20px;
    h3 {
      font-size: 20px;
      margin: 10px 0px;
    }
  }
`;

const OpenedFAQ = styled.div`
  width: 100%;
  background: linear-gradient(126.97deg, #a22739 6.32%, #ff323c 168.75%);
  mix-blend-mode: normal;
  box-shadow: 0px 40px 100px rgba(225, 37, 37, 0.3);
  border-radius: 18px;
  padding: 50px;
  font-family: "Londrina Solid";
  font-style: normal;
  box-sizing: border-box;
  position: relative;

  h3 {
    font-weight: 400;
    font-size: 36px;
    line-height: 43px;
    /* identical to box height */

    letter-spacing: 0.03em;
    text-transform: capitalize;
    margin-top: 0px;
  }
  p {
    font-weight: 300;
    font-size: 17px;
    line-height: 26px;
    /* or 153% */

    letter-spacing: 1px;
    text-transform: uppercase;
    text-align: start;

    width: 100%;
  }

  &:hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 1100px) {
    h3 {
      font-size: 28px;
    }
    p {
      font-size: 12px;
    }
  }
  @media only screen and (max-width: 420px) {
    padding: 20px;
    h3 {
      font-size: 20px;
    }
    p {
      font-size: 8px;
    }
  }
`;

const BB1 = styled.div`
  position: absolute;
  box-sizing: border-box;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background: transparent;
  color: rgba(white, 0.7);
  box-shadow: inset 0 0 0 1px rgba(white, 0.5);

  &::after {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0px;
    right: 0;
    content: "";
    margin: -2px;
    box-shadow: inset 0 0 0 2px;
    animation: ${BorderKeyFrame(100, 1300)} 2s ease-in-out infinite alternate;
    border-radius: 18px;
  }
`;

const TeamContainer = styled.div`
  width: 100%;
  height: 150vh;
  background: #1b1b1b url("/assets/image/contact-back.png");
  background-size: 100% 150vh;
  font-family: "Londrina Solid";
  font-style: normal;
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-around;
  padding: 200px 0px;

  h5 {
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;

    text-transform: uppercase;
    margin: 0px;
  }
  h1 {
    font-size: 60px;
    line-height: 68px;
    letter-spacing: 2px;
    margin: 10px 0px;
    text-transform: uppercase;
  }
  @media only screen and (max-width: 900px) {
    height: auto;
    background-size: 100% 100%;
    padding-bottom: 0px;
  }
  @media only screen and (max-width: 520px) {
    h1 {
      font-size: 44px;
      line-height: 48px;
    }
  }
`;

const MemberContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 100px 0px;

  * {
    margin: 10px;
  }

  &:nth-child(2n) {
    animation-delay: 1s;
  }
  @media only screen and (max-width: 900px) {
    flex-wrap: wrap;
  }
`;

const TeamMember = styled.div`
  width: 250px;
  height: 350px;
  background-color: transparent;
  background-image: url("assets/image/member-back.png");
  background-size: 250px 350px;
  position: relative;
  animation: ${JumpManKeyFrame(50)} 2s ease-in-out infinite alternate;

  img {
    position: absolute;
    width: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-55%, -60%);
  }

  h4 {
    position: absolute;
    bottom: 0px;
    left: 20px;
    font-family: "Londrina Solid";
    font-style: normal;
    font-weight: 400;
    font-size: 22.3885px;
    line-height: 162.3%;
    letter-spacing: 0.03em;
    text-transform: capitalize;
    margin: 8px 0px;

    color: #ffffff;
  }
`;

const RoadmapData = [
  {
    title: "$DSKT",
    description:
      "Official utility token that provides a way to access our product line, including Shop, internal services, discounts on secondary NFT collections, in-game decisions, the DAO vote，and holder access to high-end perks. Most of these utilities will have combustion mechanisms to reduce total supply.",
    float: "left",
    margin: 1,
    trans: 0,
  },
  {
    title: "Staking",
    description:
      "Put your dokesi in a float tank and you decide how long - you can unstake at any given time and get the rewards you get. Staking 1 dokesi will generate 10 $DKST per day, If you staking 3 dokesi, each dokesi will give you an extra x1.25 $DKST!",
    float: "left",
    margin: 27,
    trans: -25,
  },
  {
    title: "Farms",
    description:
      "Send your dokesi to the farm to work for you. The higher the work intensity, the more $DKST rewards, and you can get up to X2 $DKST.",
    float: "right",
    margin: 22.5,
    trans: -40,
  },
  {
    title: "DAO",
    description:
      "Establish the DokesiDAO for all holders Exclusive DAO channels, alpha, collaborations, and giveaways Setup & fund DokesiDAO treasury.",
    float: "left",
    margin: 29,
    trans: -20,
  },
  {
    title: "Evolution",
    description:
      "Dokesi accidentally got the gene potion. Some Dokesi was promoted to advanced species, and then many stories happened. Part of the series will be presented through $DKST mint, and perhaps some will be presented by burning NFT.",
    float: "right",
    margin: 14.5,
    trans: -10,
  },
  {
    title: "House",
    description:
      "Every Dokesi in the future meta-universe needs a house and maybe a pet. to be continued",
    float: "left",
    margin: 17.5,
    trans: 0,
  },
];

const FaqData = [
  {
    question: "Who are the Dokesi？",
    answer:
      "Dokesi is a PFP inspired by short film animation, with rich and unique rare features, dozens of rare avatars, costumes, and color schemes. We started with PFP, and the world of Dokesi continues to expand.",
  },
  {
    question: "How many Dokesi are there?",
    answer:
      "Our genesis collection consists of 6668 unique 1/1 characters who live on the Solana Blockchain. They are all hand-drawn, 100% original, and randomly generated through the script.",
  },
  {
    question: "When was the Dokesi mint？",
    answer: "Our genesis collection was minted on June 15th, 2022.",
  },
  {
    question: "How do I buy NFT?",
    answer:
      "All you need are Solana coins, a compatible wallet (Phantom), and our website.",
  },
  {
    question: "How do I set up a wallet?",
    answer:
      "We recommend using Phantom wallet if you are minting on desktop. For more information about how to set up a Phantom wallet visit: help.phantom.app",
  },
  {
    question: "How do I add funds to my wallet?",
    answer:
      "To add funds to your wallet you will need to buy the Solana coin (SOL). This can be done on any exchange wallet (Binance, Coinbase,…).<br>Next you will need to go to your account created on Phantom, Solflare, Sollet. Click on ‘Deposit SOL’ and copy your SOL address which will look something like this: …<br>Go over to SOL on your exchange wallet and choose ‘Send SOL’. You can now paste the address and send your SOL to your minting wallet.",
  },
  {
    question: "What are the maximum mints per wallet?",
    answer: "Three mint per wallet is allowed per allowlist winner.",
  },
  {
    question: "How are these 6,668 Dokesi distributed?",
    answer:
      "6,500: To the whitelist winner mints <br>168: Future cooperation, marketing, and sweepstakes",
  },
];

const Home = () => {
  const [faqIndex, setFaqIndex] = useState(-1);
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const clickFaqHandler = (index: number) => {
    if (index === faqIndex) {
      setFaqIndex(-1);
      return;
    }

    setFaqIndex(index);
  };

  const goToMint = () => {
    window.location.href = "/mint";
  };
  return (
    <>
      <HomeContainer id="home">
        <TitlePart>
          <h5>Dokesi is a PFP for short film animation.</h5>
          <h1>
            discover best <RedSpane>digital art</RedSpane> and collect nfts
          </h1>
          <p>
            This is the lair of the faceless spirit skulls. The more time you
            spend here, the more thrilling your experience will be
          </p>
          <ConnectButton onClick={goToMint}>
            {/* <BBButton /> */}
            Mint Now
          </ConnectButton>
        </TitlePart>
        <HomeMan src="/assets/image/home-man1.png" />
      </HomeContainer>
      <AboutContainer id="about">
        <h5>
          <RedSpane>About US</RedSpane>
        </h5>
        <h1>About dokesi.io</h1>
        <p>
          This is the lair of the faceless spirit skulls. The more time you
          spend here, the more thrilling your experience will be
        </p>
        <AboutBox>
          <h4>
            <RedSpane>dokesi.io</RedSpane>
          </h4>
          <p>
            Dokesi is a PFP designed for short film animation. It launches 6,668
            independent digital NFT collections on Solana blockchain, with rich,
            diverse and unique rare features, dozens of rare headshots, costumes
            and color schemes. We started with 6,668 PFP, and the world of
            Dokesi is constantly expanding. The new experience of Dokesi is only
            open to holders. With the expansion of the universe, our brand is
            constantly developing.
          </p>
          <BB />
          <FlyPane />
          <AboutUsMan src="/assets/image/home-man2.png" />
        </AboutBox>
        <BackMan1 src="/assets/image/home-back-man1.png" />
      </AboutContainer>
      <TrendingContainer>
        <h5>About US</h5>
        <h1>
          Treanding <RedSpane>this week</RedSpane>
        </h1>
        <p>
          This is the lair of the faceless spirit skulls. The more time you
          spend here, the more thrilling your experience will be
        </p>
        <CarouselView>
          <CarouselPane>
            <CarouselItem>
              <img src="/assets/image/home-man5.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man6.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man3.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man4.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man5.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man6.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man3.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man4.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man5.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man6.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man3.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man4.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man5.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man6.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
          </CarouselPane>
          <CarouselPane style={{ animationDelay: "1s" }}>
            <CarouselItem>
              <img src="/assets/image/home-man5.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man6.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man3.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man4.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man5.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man6.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man3.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man4.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man5.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man6.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man3.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man4.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man5.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
            <CarouselItem>
              <img src="/assets/image/home-man6.png" alt="man1" />
              <h4>Man1</h4>
            </CarouselItem>
          </CarouselPane>
        </CarouselView>
      </TrendingContainer>
      <RoadmapContainer id="roadmap">
        <BackMan2 src="/assets/image/back-man1.png" />
        <BackLetterView>
          <BackLetterPane>
            <span>dokesi.io dokesi.io dokesi.io</span>
          </BackLetterPane>
        </BackLetterView>
        <h5>
          <RedSpane>About US</RedSpane>
        </h5>
        <h1>Roadmap</h1>
        <p>
          It's now time for the human race to repay the Azuki's favor by saving
          them from Shirokinja slavery, which won't come without a cost.
          However, rather than blood, wars, and death, we bring you a seamless
          approach to save them. Every purchase from this collection can free an
          azuki. It's the least you can do for humans' greatest defenders.
        </p>
        <Roadmap ref={ref}>
          <RoadmapBackLine
            style={
              inView
                ? { animationPlayState: "running" }
                : { animationPlayState: "paused" }
            }
          />
          {RoadmapData.map((data: any, index: number) => (
            <AnimationOnScroll
              animateIn="fadeInDownBig"
              animateOnce
              key={index}
            >
              <RoadmapItem
                float={data.float}
                margin={data.margin}
                trans={data.trans}
                className="item"
              >
                <h1>0{index + 1}</h1>
                <div>
                  <h4>{data.title}</h4>
                  <p>{data.description}</p>
                </div>
              </RoadmapItem>
            </AnimationOnScroll>
          ))}
        </Roadmap>
      </RoadmapContainer>
      <FAQContainer id="faq">
        <h4>
          <RedSpane>Faq</RedSpane>
        </h4>
        <h1>
          Have any <RedSpane>Question?</RedSpane>
        </h1>
        <p>
          It's now time for the human race to repay the Azuki's favor by saving
          them from Shirokinja slavery, which won't come without a cost.
          However, rather than blood, wars, and death, we bring you a seamless
          approach to save them. Every purchase from this collection can free an
          azuki. It's the least you can do for humans' greatest defenders.
        </p>
        <FAQList>
          {FaqData.map((data: any, index: number) => {
            return index === faqIndex ? (
              <OpenedFAQ onClick={() => clickFaqHandler(index)} key={index}>
                <h3>{data.question}</h3>
                <p>{data.answer}</p>
                <BB1 />
              </OpenedFAQ>
            ) : (
              <ClosedFAQ onClick={() => clickFaqHandler(index)} key={index}>
                <h3>{data.question}</h3>
              </ClosedFAQ>
            );
          })}
        </FAQList>
      </FAQContainer>
      <TeamContainer id="team">
        <h5>
          <RedSpane>About us</RedSpane>
        </h5>
        <h1>Dokesi.io Team</h1>
        <MemberContainer>
          <TeamMember>
            <img src="/assets/image/home-man3.png" alt="team member" />
            <h4>Team Hero</h4>
          </TeamMember>
          <TeamMember style={{ animationDelay: "2s" }}>
            <img src="/assets/image/home-man4.png" alt="team member" />
            <h4>Team Hero</h4>
          </TeamMember>
          <TeamMember>
            <img src="/assets/image/home-man5.png" alt="team member" />
            <h4>Team Hero</h4>
          </TeamMember>
          <TeamMember style={{ animationDelay: "2s" }}>
            <img src="/assets/image/home-man6.png" alt="team member" />
            <h4>Team Hero</h4>
          </TeamMember>
        </MemberContainer>
      </TeamContainer>
    </>
  );
};

export default Home;
