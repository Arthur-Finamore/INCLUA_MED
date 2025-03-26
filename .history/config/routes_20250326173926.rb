Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  root "pages#index"
  
  # Pages
  get "main" => "pages#main"
  get "instrucoes" => "pages#instrucoes"
  get "procedures" => "pages#procedures"
  get "opine" => "pages#opine"

  # Procedures
  get 'procedures/apresentacao', to: 'procedures#apresentacao'
  get 'procedures/pre_exame', to: 'procedures#pre_exame'
  get 'procedures/acuidade', to: 'procedures#acuidade'
  get 'procedures/biomicroscopia', to: 'procedures#biomicroscopia'
  get 'procedures/refracao', to: 'procedures#refracao'
  get 'procedures/tonometria', to: 'procedures#tonometria'
end
