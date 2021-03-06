import React, {useState} from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from "reactstrap";

const UserCreation = ({doLogin}) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessageShown, setErrorMessageShown] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const registerUser = async () => {
    const credentials = {username: username, password: password, userRole: "basicUser"}
    try{
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
        .then((res) => {
          if(res.ok){
            setModal(false)
            setErrorMessageShown(false)
            doLogin()
          }
          else{
            setErrorMessageShown(true)
          }
        })
        .catch((error) => console.error(error));
    }
    catch{
      console.log("error");
    }
  }

  const validPassword = (password) => {
    let start = `Password needs to contain at least`;
    if (!password.match(/[a-z]+/)) return `${start} one lowercase letter`;
    if (!password.match(/[A-Z]+/)) return `${start} one uppercase letter`;
    if (!password.match(/[0-9]+/)) return `${start} one digit`;
    if (!password.match(/[$@#&!]+/)) return `${start} one special character`;
    if (password.length < 5) return `${start} 10 characters`;
    return null;
  };

  return(
    <div>
      <div className="text-center m-4" onClick={toggle}>
        <p className="font-italic mb-0">Don't have an account?</p>
        <p className="font-italic">
          {" "}
          Register{" "}
          <span className="text-primary click-text inline">
            <span>here</span>
          </span>
        </p>
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader className="text-center mx-auto">Register</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup className="col-xs-8 col-sm-12 col-md-12 col-lg-12 m-0">
              <Label
                for="emailAddress"
                className="forum-dark-grey font-weight-bold col-12"
              >
                Username
              </Label>
              <Input
                required
                className="light-light-grey-background forum-input"
                type="text"
                placeholder="Username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="col-xs-8 col-sm-12 col-md-12 col-lg-12 mt-2">
              <Label
             for="password"
              className="forum-dark-grey font-weight-bold col-12"
            >
              Lösenord
            </Label>
             <Input
                required
                className="light-light-grey-background forum-input col-10 noBorder"
                type="password"
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            <FormGroup className="col-xs-8 col-sm-12 col-md-12 col-lg-12 mt-2">
              {errorMessageShown ? (
                <div className="error-text mb-2 text-center font-weight-bold">
                  {validPassword(password)}
                </div>
              ) : (
                ""
              )}
              <Button className="forum-button col-xs-8 col-sm-12 col-md-12 col-lg-12 font-weight-bold" onClick={() => registerUser()}>
                Register
              </Button>
            </FormGroup>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="forum-button" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )

}

export default UserCreation