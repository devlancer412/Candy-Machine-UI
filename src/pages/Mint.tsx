import { useEffect, useMemo, useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";

import styled from "styled-components";
import { keyframes } from "styled-components";
import { Snackbar, useMediaQuery } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import {
  awaitTransactionSignatureConfirmation,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM,
  getCandyMachineState,
  mintOneToken,
  getCollectionPDA,
  SetupState,
  createAccountsForMint,
} from "../services/candy-machine";
import {
  AlertState,
  toDate,
  formatNumber,
  getAtaForMint,
} from "../services/utils";
import { MintCountdown } from "../components/MintCountdown";
import { MintButton } from "../components/MintButton";
import { GatewayProvider } from "@civic/solana-gateway-react";
import { sendTransaction } from "../services/connection";

const ConnectButton = styled(WalletDialogButton)`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 5px;
  background: url("/assets/image/redbtn-back.png");
  background-size: 100% 60px;
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

const HeaderBack = styled.div`
  width: 100%;
  height: 104px;
  background: linear-gradient(93.48deg, #a22739 59.76%, #ff323c 174.66%);
  @media only screen and (max-width: 1366px) {
    height: 88px;
  }
  @media only screen and (max-width: 750px) {
    height: 72px;
  }
`;

const FirstContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  height: calc(100vh - 104px);
  margin: auto 0px;
  padding: 10vh 0px;
  box-sizing: border-box;
  flex-wrap: wrap;
  @media only screen and (max-width: 1100px) {
    height: auto;
  }
`;

const SingerImg = styled.img`
  width: 40%;
  height: auto;
  @media only screen and (max-width: 1100px) {
    width: 100%;
  }
`;

const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 100px;

  h1 {
    color: white;
    font-size: 40px;
    line-height: 100px;
  }
  @media only screen and (max-width: 1100px) {
    width: 70%;
    margin: auto;
    align-items: center;
    h1 {
      text-align: center;
    }
  }
  @media only screen and (max-width: 750px) {
    width: 90%;
    h1 {
      font-size: 36px;
    }
  }
  @media only screen and (max-width: 410px) {
    h1 {
      font-size: 32px;
    }
  }
`;

const clipMe = (
  width: number,
  height: number,
  borderWidth: number
) => keyframes`
  0%, 100% {clip: rect(0px, ${width}px, ${borderWidth}px, 0px); }
  25% {clip: rect(0px, ${borderWidth}px, ${height}px, 0px); }
  50% {clip: rect(${height - borderWidth}px, ${width}px, ${height}px, 0px); }
  75% {clip: rect(0px, ${width}px, ${height}px, ${width - borderWidth}px); }
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
  color: green;
  box-shadow: inset 0 0 0 1px rgba(white, 0.5);

  &::before,
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
    animation: ${clipMe(607, 285, 2)} 2s linear infinite;
    border-radius: 17px;
  }

  &::before {
    animation-delay: -1s;
  }
  @media only screen and (max-width: 1365px) {
    &::before,
    &::after {
      animation: ${clipMe(500, 283, 2)} 2s linear infinite;
    }
    &::before {
      animation-delay: -1s;
    }
  }
  @media only screen and (max-width: 570px) {
    &::before,
    &::after {
      animation: ${clipMe(400, 283, 2)} 2s linear infinite;
    }
    &::before {
      animation-delay: -1s;
    }
  }
  @media only screen and (max-width: 450px) {
    &::before,
    &::after {
      animation: ${clipMe(300, 283, 2)} 2s linear infinite;
    }
    &::before {
      animation-delay: -1s;
    }
  }
`;

const MintBox = styled.div`
  width: 607px;
  background: #131313;
  border-radius: 17px;
  border: 2px solid;
  border-color: red;
  box-sizing: border-box;
  padding: 20px 35px;
  display: flex;
  flex-direction: column;
  position: relative;
  @media only screen and (max-width: 1365px) {
    width: 500px;
  }
  @media only screen and (max-width: 570px) {
    width: 400px;
  }
  @media only screen and (max-width: 450px) {
    width: 300px;
  }
`;

const ValueViewPane = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  padding: 10px 0px;
`;

const TextContainder = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelText = styled.label`
  font-family: "Londrina Solid";
  font-style: normal;
  font-weight: 300;
  font-size: 17px;
  line-height: 26px;
  /* identical to box height, or 153% */

  letter-spacing: 1px;
  text-transform: capitalize;

  color: #969696;
  @media only screen and (max-width: 1365px) {
    font-size: 16px;
  }
  @media only screen and (max-width: 620px) {
    font-size: 12px;
  }
  @media only screen and (max-width: 450px) {
    font-size: 10px;
  }
`;

const ValueText = styled.label`
  font-family: "Londrina Solid";
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 47px;
  letter-spacing: 1px;
  text-transform: capitalize;

  color: #ffffff;
  @media only screen and (max-width: 1365px) {
    font-size: 32px;
  }
  @media only screen and (max-width: 620px) {
    font-size: 24px;
  }
  @media only screen and (max-width: 450px) {
    font-size: 16px;
  }
`;

const VerticalSeparator = styled.div`
  position: relative;
  width: 2px;
  height: 95px;

  background: radial-gradient(
    50% 50% at 50% 50%,
    #ff3232 0%,
    rgba(255, 50, 50, 0) 94.27%
  );
  opacity: 0.5;
`;

const HorizontalSeparator = styled.div`
  position: relative;
  width: 100%;
  height: 2px;
  margin: 10px 0px;

  background: radial-gradient(
    50% 50% at 50% 50%,
    #ff3232 0%,
    rgba(255, 50, 50, 0) 94.27%
  );
  opacity: 0.5;
`;

const BackgroundImage = styled.img`
  position: absolute;
  width: 300px;
  z-index: 0;
  left: 50%;
  transform: translate(-80%, 0);
  @media only screen and (max-width: 1100px) {
    transform: translate(-50%, 0);
  }
`;

const SecondContainer = styled.div`
  width: 100%;
  height: 500px;
  background-image: url("/assets/image/contact-back.png");
  background-size: 100vw 500px;
  display: flex;
  padding: 150px 20px;
  box-sizing: border-box;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 70px;
  @media only screen and (max-width: 1100px) {
    height: 735px;
    background-size: 100vw 735px;
  }
  @media only screen and (max-width: 620px) {
    height: 830px;
    background-size: 100vw 850px;
  }
`;

const QueryLabel = styled.div`
  width: 40%;
  margin-right: 50px;
  @media only screen and (max-width: 1100px) {
    width: 70%;
    margin-right: 0px;
  }
  @media only screen and (max-width: 620px) {
    width: 90%;
  }
`;
const QueryLabelTitle = styled.h1`
  margin: 0px;
  font-family: "Londrina Solid";
  font-style: normal;
  font-weight: 400;
  font-size: 80px;
  line-height: 88px;
  /* or 110% */

  letter-spacing: 3px;
  color: white;
  text-transform: uppercase;
  @media only screen and (max-width: 1365px) {
    font-size: 72px;
  }
  @media only screen and (max-width: 620px) {
    font-size: 52px;
  }
  @media only screen and (max-width: 410px) {
    font-size: 36px;
  }
`;

const QueryLabelSub = styled.h1`
  margin: 0px;
  font-family: "Londrina Solid";
  font-style: normal;
  font-weight: 300;
  font-size: 22px;
  line-height: 88px;
  /* identical to box height, or 400% */

  letter-spacing: 1px;
  text-transform: uppercase;

  color: #ffffff;
  @media only screen and (max-width: 420px) {
    font-size: 24px;
  }
  @media only screen and (max-width: 620px) {
    font-size: 16px;
  }
  @media only screen and (max-width: 410px) {
    font-size: 12px;
  }
`;

const QueryForm = styled.form`
  width: 30%;
  font-family: "Raleway";
  font-style: normal;
  font-size: 13px;
  font-stretch: 100%;
  @media only screen and (max-width: 1100px) {
    width: 70%;
  }
  @media only screen and (max-width: 620px) {
    width: 90%;
  }
`;

interface QueryInputProps {
  float: string;
}

const QueryInput = styled.input`
  width: calc(50% - 2px);
  float: ${(props: QueryInputProps) => props.float};
  outline-width: 0;
  box-sizing: border-box;
  padding: 20px;
  border: 0px;
  font-family: "Londrina Solid";
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  letter-spacing: 1px;
  text-transform: capitalize;

  color: #ffffff;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid #ffffff;
  box-shadow: 3px 16px 80px rgba(121, 0, 0, 0.26);
  border-radius: 6.45px;
  @media only screen and (max-width: 620px) {
    width: 100%;
    margin-top: 4px;
  }
`;

const QueryText = styled.textarea`
  width: 100%;
  margin-top: 4px;
  box-sizing: border-box;
  padding: 20px;
  height: 150px;
  font-family: "Londrina Solid";
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  letter-spacing: 1px;
  text-transform: capitalize;

  color: #ffffff;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid #ffffff;
  box-shadow: 3px 16px 80px rgba(121, 0, 0, 0.26);
  border-radius: 6.45px;
  border: "0px";
  outline-width: 0;
`;

const SendMsgBtn = styled.button`
  font-family: "Roboto";
  font-style: normal;
  font-size: 13px;
  font-weight: 400;
  background: url("/assets/image/redbtn-small-back.png");
  background-size: 100% 56px;
  text-transform: uppercase;
  padding: 20px 35px;
  border: 0px;
  outline-width: 0;
  color: white;
  margin-top: 5px;
  cursor: pointer;
  @media only screen and (max-width: 420px) {
    width: 100%;
    margin-top: 4px;
  }
`;

const MintContainer = styled.div``;

export interface MintProps {
  candyMachineId?: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  txTimeout: number;
  rpcHost: string;
}

const Mint = (props: MintProps) => {
  const [isUserMinting, setIsUserMinting] = useState(false);
  const [candyMachine, setCandyMachine] = useState<CandyMachineAccount>();
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [isActive, setIsActive] = useState(false);
  const [endDate, setEndDate] = useState<Date>();
  const [itemsRemaining, setItemsRemaining] = useState<number>();
  const [isWhitelistUser, setIsWhitelistUser] = useState(false);
  const [isPresale, setIsPresale] = useState(false);
  const [discountPrice, setDiscountPrice] = useState<anchor.BN>();
  const [needTxnSplit, setNeedTxnSplit] = useState(true);
  const [setupTxn, setSetupTxn] = useState<SetupState>();

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [qmessage, setQMessage] = useState<string>("");

  const rpcUrl = props.rpcHost;
  const wallet = useWallet();

  const matchesSM = useMediaQuery("(max-width:1100px)");

  const sendMsg = () => {
    setEmail("");
    setFullName("");
    setQMessage("");
    setAlertState({
      open: true,
      message: `Successfully sended!`,
      severity: "info",
      noHide: false,
    });
  };

  const anchorWallet = useMemo(() => {
    if (
      !wallet ||
      !wallet.publicKey ||
      !wallet.signAllTransactions ||
      !wallet.signTransaction
    ) {
      return;
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction,
    } as anchor.Wallet;
  }, [wallet]);

  const refreshCandyMachineState = useCallback(async () => {
    if (!anchorWallet) {
      return;
    }

    if (props.candyMachineId) {
      try {
        const cndy = await getCandyMachineState(
          anchorWallet,
          props.candyMachineId,
          props.connection
        );
        let active =
          cndy?.state.goLiveDate?.toNumber() < new Date().getTime() / 1000;
        let presale = false;
        // whitelist mint?
        if (cndy?.state.whitelistMintSettings) {
          // is it a presale mint?
          if (
            cndy.state.whitelistMintSettings.presale &&
            (!cndy.state.goLiveDate ||
              cndy.state.goLiveDate.toNumber() > new Date().getTime() / 1000)
          ) {
            presale = true;
          }
          // is there a discount?
          if (cndy.state.whitelistMintSettings.discountPrice) {
            setDiscountPrice(cndy.state.whitelistMintSettings.discountPrice);
          } else {
            setDiscountPrice(undefined);
            // when presale=false and discountPrice=null, mint is restricted
            // to whitelist users only
            if (!cndy.state.whitelistMintSettings.presale) {
              cndy.state.isWhitelistOnly = true;
            }
          }
          // retrieves the whitelist token
          const mint = new anchor.web3.PublicKey(
            cndy.state.whitelistMintSettings.mint
          );
          const token = (await getAtaForMint(mint, anchorWallet.publicKey))[0];

          try {
            const balance = await props.connection.getTokenAccountBalance(
              token
            );
            let valid = parseInt(balance.value.amount) > 0;
            // only whitelist the user if the balance > 0
            setIsWhitelistUser(valid);
            active = (presale && valid) || active;
          } catch (e) {
            setIsWhitelistUser(false);
            // no whitelist user, no mint
            if (cndy.state.isWhitelistOnly) {
              active = false;
            }
            console.log("There was a problem fetching whitelist token balance");
            console.log(e);
          }
        }
        // datetime to stop the mint?
        if (cndy?.state.endSettings?.endSettingType.date) {
          setEndDate(toDate(cndy.state.endSettings.number));
          if (
            cndy.state.endSettings.number.toNumber() <
            new Date().getTime() / 1000
          ) {
            active = false;
          }
        }
        // amount to stop the mint?
        if (cndy?.state.endSettings?.endSettingType.amount) {
          let limit = Math.min(
            cndy.state.endSettings.number.toNumber(),
            cndy.state.itemsAvailable
          );
          if (cndy.state.itemsRedeemed < limit) {
            setItemsRemaining(limit - cndy.state.itemsRedeemed);
          } else {
            setItemsRemaining(0);
            cndy.state.isSoldOut = true;
          }
        } else {
          setItemsRemaining(cndy.state.itemsRemaining);
        }

        if (cndy.state.isSoldOut) {
          active = false;
        }

        const [collectionPDA] = await getCollectionPDA(props.candyMachineId);
        const collectionPDAAccount =
          await cndy.program.provider.connection.getAccountInfo(collectionPDA);

        setIsActive((cndy.state.isActive = active));
        setIsPresale((cndy.state.isPresale = presale));
        setCandyMachine(cndy);

        const txnEstimate =
          892 +
          (!!collectionPDAAccount && cndy.state.retainAuthority ? 182 : 0) +
          (cndy.state.tokenMint ? 177 : 0) +
          (cndy.state.whitelistMintSettings ? 33 : 0) +
          (cndy.state.whitelistMintSettings?.mode?.burnEveryTime ? 145 : 0) +
          (cndy.state.gatekeeper ? 33 : 0) +
          (cndy.state.gatekeeper?.expireOnUse ? 66 : 0);

        setNeedTxnSplit(txnEstimate > 1230);
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === `Account does not exist ${props.candyMachineId}`) {
            setAlertState({
              open: true,
              message: `Couldn't fetch candy machine state from candy machine with address: ${props.candyMachineId}, using rpc: ${props.rpcHost}! You probably typed the REACT_APP_CANDY_MACHINE_ID value in wrong in your .env file, or you are using the wrong RPC!`,
              severity: "error",
              noHide: true,
            });
          } else if (e.message.startsWith("failed to get info about account")) {
            setAlertState({
              open: true,
              message: `Couldn't fetch candy machine state with rpc: ${props.rpcHost}! This probably means you have an issue with the REACT_APP_SOLANA_RPC_HOST value in your .env file, or you are not using a custom RPC!`,
              severity: "error",
              noHide: true,
            });
          }
        } else {
          setAlertState({
            open: true,
            message: `${e}`,
            severity: "error",
            noHide: true,
          });
        }
        console.log(e);
      }
    } else {
      setAlertState({
        open: true,
        message: `Your REACT_APP_CANDY_MACHINE_ID value in the .env file doesn't look right! Make sure you enter it in as plain base-58 address!`,
        severity: "error",
        noHide: true,
      });
    }
  }, [anchorWallet, props.candyMachineId, props.connection, props.rpcHost]);

  const onMint = async (
    beforeTransactions: Transaction[] = [],
    afterTransactions: Transaction[] = []
  ) => {
    try {
      setIsUserMinting(true);
      document.getElementById("#identity")?.click();
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        let setupMint: SetupState | undefined;
        if (needTxnSplit && setupTxn === undefined) {
          setAlertState({
            open: true,
            message: "Please sign account setup transaction",
            severity: "info",
          });
          setupMint = await createAccountsForMint(
            candyMachine,
            wallet.publicKey
          );
          let status: any = { err: true };
          if (setupMint.transaction) {
            status = await awaitTransactionSignatureConfirmation(
              setupMint.transaction,
              props.txTimeout,
              props.connection,
              true
            );
          }
          if (status && !status.err) {
            setSetupTxn(setupMint);
            setAlertState({
              open: true,
              message:
                "Setup transaction succeeded! Please sign minting transaction",
              severity: "info",
            });
          } else {
            setAlertState({
              open: true,
              message: "Mint failed! Please try again!",
              severity: "error",
            });
            setIsUserMinting(false);
            return;
          }
        } else {
          setAlertState({
            open: true,
            message: "Please sign minting transaction",
            severity: "info",
          });
        }

        let mintOne = await mintOneToken(
          candyMachine,
          wallet.publicKey,
          beforeTransactions,
          afterTransactions,
          setupMint ?? setupTxn
        );
        const mintTxId = mintOne[0];

        let status: any = { err: true };
        if (mintTxId) {
          status = await awaitTransactionSignatureConfirmation(
            mintTxId,
            props.txTimeout,
            props.connection,
            true
          );
        }

        if (status && !status.err) {
          // manual update since the refresh might not detect
          // the change immediately
          let remaining = itemsRemaining! - 1;
          setItemsRemaining(remaining);
          setIsActive((candyMachine.state.isActive = remaining > 0));
          candyMachine.state.isSoldOut = remaining === 0;
          setSetupTxn(undefined);
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (!error.message) {
          message = "Transaction timeout! Please try again.";
        } else if (error.message.indexOf("0x137")) {
          console.log(error);
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          console.log(error);
          message = `SOLD OUT!`;
          window.location.reload();
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
      // updates the candy machine state to reflect the latest
      // information on chain
      refreshCandyMachineState();
    } finally {
      setIsUserMinting(false);
    }
  };

  const toggleMintButton = () => {
    let active = !isActive || isPresale;

    if (active) {
      if (candyMachine!.state.isWhitelistOnly && !isWhitelistUser) {
        active = false;
      }
      if (endDate && Date.now() >= endDate.getTime()) {
        active = false;
      }
    }

    if (
      isPresale &&
      candyMachine!.state.goLiveDate &&
      candyMachine!.state.goLiveDate.toNumber() <= new Date().getTime() / 1000
    ) {
      setIsPresale((candyMachine!.state.isPresale = false));
    }

    setIsActive((candyMachine!.state.isActive = active));
  };

  useEffect(() => {
    refreshCandyMachineState();
  }, [
    anchorWallet,
    props.candyMachineId,
    props.connection,
    refreshCandyMachineState,
  ]);

  return (
    <Paper style={{ backgroundColor: "transparent" }}>
      <HeaderBack></HeaderBack>
      <FirstContainer>
        <BackgroundImage
          src="/assets/image/back-man1.png"
          style={matchesSM ? { bottom: "300px" } : { top: "0px" }}
        />
        <BackgroundImage
          src="/assets/image/back-man2.png"
          style={{ bottom: "-100px" }}
        />
        <SingerImg
          src={`/assets/image/mint-singer.png`}
          alt="singer"
          loading="lazy"
        />
        <RightBox>
          <h1>Mint your Male singer NFT</h1>
          <MintBox>
            <BB />
            {!wallet.connected ? (
              <ConnectButton>Connect Wallet</ConnectButton>
            ) : (
              <>
                {candyMachine && (
                  <>
                    <ValueViewPane>
                      <TextContainder>
                        <LabelText>Remaining</LabelText>
                        <ValueText>{`${itemsRemaining}`}</ValueText>
                      </TextContainder>
                      <TextContainder>
                        <LabelText>
                          {isWhitelistUser && discountPrice
                            ? "Discount Price"
                            : "Price"}
                        </LabelText>
                        <ValueText>
                          {isWhitelistUser && discountPrice
                            ? `◎ ${formatNumber.asNumber(discountPrice)}SOL`
                            : `◎ ${formatNumber.asNumber(
                                candyMachine.state.price
                              )}SOL`}
                        </ValueText>
                      </TextContainder>
                      <VerticalSeparator />
                      <TextContainder>
                        {isActive &&
                        endDate &&
                        Date.now() < endDate.getTime() ? (
                          <>
                            <MintCountdown
                              key="endSettings"
                              date={getCountdownDate(candyMachine)}
                              style={{ justifyContent: "flex-end" }}
                              status="COMPLETED"
                              onComplete={toggleMintButton}
                            />
                            <Typography
                              variant="caption"
                              align="center"
                              display="block"
                              style={{ fontWeight: "bold" }}
                            >
                              TO END OF MINT
                            </Typography>
                          </>
                        ) : (
                          <>
                            <MintCountdown
                              key="goLive"
                              date={getCountdownDate(candyMachine)}
                              style={{ justifyContent: "flex-end" }}
                              status={
                                candyMachine?.state?.isSoldOut ||
                                (endDate && Date.now() > endDate.getTime())
                                  ? "COMPLETED"
                                  : isPresale
                                  ? "PRESALE"
                                  : "LIVE"
                              }
                              onComplete={toggleMintButton}
                            />
                            {isPresale &&
                              candyMachine.state.goLiveDate &&
                              candyMachine.state.goLiveDate.toNumber() >
                                new Date().getTime() / 1000 && (
                                <Typography
                                  variant="caption"
                                  align="center"
                                  display="block"
                                  style={{ fontWeight: "bold" }}
                                >
                                  UNTIL PUBLIC MINT
                                </Typography>
                              )}
                          </>
                        )}
                      </TextContainder>
                    </ValueViewPane>
                    <HorizontalSeparator />
                  </>
                )}

                <MintContainer>
                  {candyMachine?.state.isActive &&
                  candyMachine?.state.gatekeeper &&
                  wallet.publicKey &&
                  wallet.signTransaction ? (
                    <GatewayProvider
                      wallet={{
                        publicKey:
                          wallet.publicKey ||
                          new PublicKey(CANDY_MACHINE_PROGRAM),
                        //@ts-ignore
                        signTransaction: wallet.signTransaction,
                      }}
                      gatekeeperNetwork={
                        candyMachine?.state?.gatekeeper?.gatekeeperNetwork
                      }
                      clusterUrl={rpcUrl}
                      handleTransaction={async (transaction: Transaction) => {
                        setIsUserMinting(true);
                        const userMustSign = transaction.signatures.find(
                          (sig) => sig.publicKey.equals(wallet.publicKey!)
                        );
                        if (userMustSign) {
                          setAlertState({
                            open: true,
                            message: "Please sign one-time Civic Pass issuance",
                            severity: "info",
                          });
                          try {
                            transaction = await wallet.signTransaction!(
                              transaction
                            );
                          } catch (e) {
                            setAlertState({
                              open: true,
                              message: "User cancelled signing",
                              severity: "error",
                            });
                            // setTimeout(() => window.location.reload(), 2000);
                            setIsUserMinting(false);
                            throw e;
                          }
                        } else {
                          setAlertState({
                            open: true,
                            message: "Refreshing Civic Pass",
                            severity: "info",
                          });
                        }
                        try {
                          await sendTransaction(
                            props.connection,
                            wallet,
                            transaction,
                            [],
                            true,
                            "confirmed"
                          );
                          setAlertState({
                            open: true,
                            message: "Please sign minting",
                            severity: "info",
                          });
                        } catch (e) {
                          setAlertState({
                            open: true,
                            message:
                              "Solana dropped the transaction, please try again",
                            severity: "warning",
                          });
                          console.error(e);
                          // setTimeout(() => window.location.reload(), 2000);
                          setIsUserMinting(false);
                          throw e;
                        }
                        await onMint();
                      }}
                      broadcastTransaction={false}
                      options={{ autoShowModal: false }}
                    >
                      <MintButton
                        candyMachine={candyMachine}
                        isMinting={isUserMinting}
                        setIsMinting={(val) => setIsUserMinting(val)}
                        onMint={onMint}
                        isActive={isActive || (isPresale && isWhitelistUser)}
                      />
                    </GatewayProvider>
                  ) : (
                    <MintButton
                      candyMachine={candyMachine}
                      isMinting={isUserMinting}
                      setIsMinting={(val) => setIsUserMinting(val)}
                      onMint={onMint}
                      isActive={isActive || (isPresale && isWhitelistUser)}
                    />
                  )}
                </MintContainer>
              </>
            )}
            <Typography
              variant="caption"
              align="center"
              display="block"
              style={{ marginTop: 7, color: "grey" }}
            >
              Powered by Dokesi.io
            </Typography>
          </MintBox>
        </RightBox>
      </FirstContainer>
      <SecondContainer>
        <QueryLabel>
          <QueryLabelTitle>Have Any Questions?</QueryLabelTitle>
          <QueryLabelSub>Get in touch with us!</QueryLabelSub>
        </QueryLabel>
        <QueryForm>
          <QueryInput
            placeholder="Full name"
            value={fullName}
            float="left"
            onChange={(e: any) => setFullName(e.target.value)}
          />
          <QueryInput
            placeholder="E-Mail address"
            value={email}
            float="right"
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <QueryText
            placeholder="Write a message"
            value={qmessage}
            onChange={(e: any) => setQMessage(e.target.value)}
          />
          <SendMsgBtn onClick={sendMsg}>send message</SendMsgBtn>
        </QueryForm>
      </SecondContainer>
      <Snackbar
        open={alertState.open}
        autoHideDuration={alertState.noHide ? null : 6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

const getCountdownDate = (
  candyMachine: CandyMachineAccount
): Date | undefined => {
  if (
    candyMachine.state.isActive &&
    candyMachine.state.endSettings?.endSettingType.date
  ) {
    return toDate(candyMachine.state.endSettings.number);
  }

  return toDate(
    candyMachine.state.goLiveDate
      ? candyMachine.state.goLiveDate
      : candyMachine.state.isPresale
      ? new anchor.BN(new Date().getTime() / 1000)
      : undefined
  );
};

export default Mint;
