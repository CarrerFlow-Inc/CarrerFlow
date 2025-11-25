import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/loginform";
import SignupForm from "../components/auth/signupform";
import AuthLayout from "../components/auth/authlayout";
import SlideToggler from "../components/auth/slidetoggler";

export default function Login() {
  const togglerRef = React.useRef(null);
  const navigate = useNavigate();
  return (
    <AuthLayout
  title="Bem-vindo de volta"
  subtitle="Entre com suas credenciais para continuar"
      footer={(
        <div className="mt-8 text-center">
          <p className="type-body-sm text-gray-600">
            Não tem uma conta?{" "}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); togglerRef.current?.switchTo("right"); }}
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Cadastre-se gratuitamente
            </a>
          </p>
        </div>
      )}
    >
      <SlideToggler
        ref={togglerRef}
        left={<LoginForm />}
        right={<SignupForm />}
        leftLabel="Login"
        rightLabel="Cadastro"
        initial="left"
        onChange={(side) => {
          if (side === "right") navigate("/signup");
        }}
      />

      {/* Google button now embedded inside LoginForm for tighter grouping; removed here */}
    </AuthLayout>
  );
}
