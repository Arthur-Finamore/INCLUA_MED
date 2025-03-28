# app/helpers/videos_helper.rb
module VideosHelper
    def youtube_embed(video_id, width: 560, height: 315)
        params = {
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            disablekb: 1,
            origin: request.base_url,
            autohide: 1,       # Esconde controles automaticamente
            playsinline: 1      # Boas práticas para mobile
        }
        
        content_tag(:div, class: "youtube-wrapper") do
            content_tag(:iframe, nil, 
            src: "https://www.youtube-nocookie.com/embed/#{video_id}?#{params.to_query}",
            width: width,
            height: height,
            frameborder: "0",
            allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: true,
            loading: "lazy",
            class: "youtube-player"
            )
        end
    end
end
