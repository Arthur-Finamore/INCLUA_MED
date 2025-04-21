class PagesController < ApplicationController
  def home
  end

  def main
  end

  def instrucoes
    render turbo_stream: turbo_stream.replace('active-screen', partial: 'pages/instrucoes')
  end

  def procedures
    render turbo_stream: turbo_stream.replace('active-screen', partial: 'pages/procedures')
  end

  def opine
    render turbo_stream: turbo_stream.replace('active-screen', partial: 'pages/opine')
  end
end
