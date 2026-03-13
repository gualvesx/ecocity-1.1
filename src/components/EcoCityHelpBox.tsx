
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TreeDeciduous, Recycle, Leaf } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const EcoCityHelpBox = () => {
  return (
    <div className="w-full py-16 bg-eco-green-light/20">
      <div className="container mx-auto px-4 max-w-none w-full">
        <div className="overflow-hidden bg-eco-green/10 backdrop-blur-sm rounded-xl shadow-lg border border-eco-green/20 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full">
            <div className="p-8 md:p-10 flex flex-col justify-center bg-white/80">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-eco-green-light/50 text-eco-green-dark mb-4">
                Iniciativa EcoCity
              </div>

              <h3 className="text-3xl md:text-4xl font-bold text-eco-green-dark mb-4">
                Ajude Sua Cidade a se Tornar mais Verde
              </h3>

              <p className="text-gray-700 mb-6">
                Junte-se ao movimento EcoCity e faça parte da transformação ambiental da sua comunidade. Cada ação conta - da reciclagem ao plantio urbano, você pode fazer a diferença!
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button className="bg-eco-green hover:bg-eco-green-dark text-white shadow-md">
                    <Leaf className="mr-2 h-5 w-5" />
                    Participar Agora
                  </Button>
                </Link>
                <Link to="/about" style={{ textDecoration: "none" }}>
                  <Button variant="outline" className="border-eco-green/80 text-eco-green-dark hover:bg-eco-green-light/30">
                    Saiba Mais
                  </Button>
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center bg-eco-green-light/20 p-3 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-eco-green mr-3 shadow-sm">
                    <TreeDeciduous className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-eco-green-dark">Apoie a Causa!</div>
                    <div className="text-sm text-gray-600">Sua cidade agradece!</div>
                  </div>
                </div>

                <div className="flex items-center bg-eco-blue-light/20 p-3 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-eco-blue mr-3 shadow-sm">
                    <Recycle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-eco-blue-dark">Viva a Ecologia!</div>
                    <div className="text-sm text-gray-600">Garanta um futuro mais Verde.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <AspectRatio ratio={4 / 3} className="md:h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-eco-green-light/20 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <img
                    src="https://s2-redeglobo.glbimg.com/VFnfZlNqO1w9SVS0XJ1BJTZOcos=/0x0:5448x3632/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2022/X/n/0ntL3DR4uswEWAyYLQjw/parque-do-povo-3.jpg"
                    alt="Cidade sustentável com áreas verdes"
                    className="w-full h-full object-cover"
                  />
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoCityHelpBox;
