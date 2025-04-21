class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :user_type, presence: true, inclusion: { in: %w[cpf cnpj] }
  validates :cpf, presence: true, if: -> { user_type == "cpf" }
  validates :cnpj, presence: true, if: -> { user_type == "cnpj" }
  validates :clinic_doctor, presence: true
  validates :phone, presence: true
  validates :name, presence: true

  has_many :user_exams
  has_many :exams, through: :user_exams
end
