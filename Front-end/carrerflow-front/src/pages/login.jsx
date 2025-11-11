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

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white type-caption">Ou continue com</span>
          </div>
        </div>

        <button className="mt-4 w-full border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors btn-hover">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-5 h-5"/>
          <span className="font-medium text-gray-700">Entrar com Google</span>
        </button>
      </div>
    </AuthLayout>
  );
}
