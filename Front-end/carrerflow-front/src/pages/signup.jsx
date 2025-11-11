import React from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/auth/signupform";
import LoginForm from "../components/auth/loginform";
import AuthLayout from "../components/auth/authlayout";
import SlideToggler from "../components/auth/slidetoggler";

export default function Signup() {
  const togglerRef = React.useRef(null);
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Criar sua conta"
      subtitle="Preencha os dados abaixo para começar"
      footer={(
        <>
          <div className="mt-8 text-center">
            <p className="type-body-sm text-gray-600">
              Já tem uma conta?{" "}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); togglerRef.current?.switchTo("left"); }}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Fazer login
              </a>
            </p>
          </div>
          <p className="type-caption text-center mt-6">
            Ao se cadastrar, você concorda com nossos{" "}
            <a href="#" className="text-indigo-600 hover:underline">Termos de Serviço</a> e{" "}
            <a href="#" className="text-indigo-600 hover:underline">Política de Privacidade</a>
          </p>
        </>
      )}
    >
      <SlideToggler
        ref={togglerRef}
        left={<LoginForm />}
        right={<SignupForm />}
        leftLabel="Login"
        rightLabel="Cadastro"
        initial="right"
        onChange={(side) => {
          if (side === "left") navigate("/login");
        }}
      />
    </AuthLayout>
  );
}
