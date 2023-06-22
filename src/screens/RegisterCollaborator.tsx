import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import xlsx from "xlsx";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";

import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

interface Collaborator {
  matricula: string;
  nome: string;
  empresa: string;
}

export function RegisterCollaborator() {
  const [isExecuting, setIsExecuting] = useState(false);

  async function handleDocument() {
    const readDocument = await DocumentPicker.getDocumentAsync({
      type: [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      copyToCacheDirectory: true,
    });

    if (readDocument.type === "success") {
      const file = await FileSystem.readAsStringAsync(readDocument.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const wb = xlsx.read(file, { type: "base64" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const dataSheet = xlsx.utils.sheet_to_json(ws, { header: 1 }).slice(1);

      const collaborators: Collaborator[] = dataSheet.map((row: any) => ({
        matricula: row[0],
        nome: row[1],
        empresa: row[2],
      })) as Collaborator[];

      const searchCollaborator = await AsyncStorage.getItem(
        "@elastri_ticket_gate:registerCollaborator"
      );

      if (!searchCollaborator) {
        await AsyncStorage.setItem(
          "@elastri_ticket_gate:registerCollaborator",
          JSON.stringify(collaborators)
        );
        Toast.show("Colaboradores cadastrados sucesso 🤝", {
          position: 150,
          duration: 1500,
          backgroundColor: "#6FDC8C",
          textColor: "#000000",
        });
      }

      const previousData = searchCollaborator
        ? JSON.parse(searchCollaborator)
        : [];

      if (previousData.lenght !== 0) {
        Toast.show("Verificando e removendo duplicados 🖨️", {
          position: 150,
          duration: 1500,
          backgroundColor: "#ffff00",
          textColor: "#000000",
        });

        setTimeout(async () => {
          for (let i = 0; i < previousData.length; i++) {
            const elementBD = previousData[i];
            const duplicateIndex = collaborators.findIndex(
              (elementCollaborator) =>
                elementCollaborator.matricula === elementBD.matricula
            );

            if (duplicateIndex !== -1) {
              collaborators.splice(duplicateIndex, 1);
            }
          }

          if (collaborators.length != 0) {
            for await (let e of collaborators) {
              const search = await AsyncStorage.getItem(
                "@elastri_ticket_gate:registerCollaborator"
              );
              const prev = search ? JSON.parse(search) : [];
              let collectionData = [...prev, e];
              await AsyncStorage.setItem(
                "@elastri_ticket_gate:registerCollaborator",
                JSON.stringify(collectionData)
              );
            }
            Toast.show("Colaboradores Adicionados 🗄️", {
              position: 150,
              duration: 2000,
              backgroundColor: "#6FDC8C",
              textColor: "#000000",
            });
          } else {
            Toast.show("Não há dados a serem registrados 🖨️", {
              position: 150,
              duration: 2000,
              backgroundColor: "#6FDC8C",
              textColor: "#000000",
            });
          }
        }, 2000);
      }
    }
  }

  async function handleArchive() {
    setIsExecuting(true);
    const searchQRCodeCollaborator = await AsyncStorage.getItem(
      "@elastri_ticket_gate:registerCollaborator"
    );

    if (!searchQRCodeCollaborator) {
      setIsExecuting(false);
      Toast.show("Não existe dados para gerar cracha 🎭", {
        position: 150,
        duration: 2000,
        backgroundColor: "#ffff00",
        textColor: "#000000",
      });
      return;
    }

    const collaborator: Collaborator[] = searchQRCodeCollaborator
      ? JSON.parse(searchQRCodeCollaborator)
      : [];

    const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
          }
          .crachaContainer {
            margin: 3px;
            align-items: center;
            justify-content: center;
            text-align: center;
            border: 1px solid black;
            width: 204px;
            height: 234px;
            align-items: center;
            background-color: white;
            border-radius: 10px;
            elevation: 3;
          }
          .nome {
            font-size: 16px;
            margin-top: 30px;
            margin-bottom: 3px;
          }
          .matricula {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .qrcode {
            margin-bottom: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container" >
          ${collaborator
            .map(
              (element) => `<div class="crachaContainer">
              <h2 class="nome">${element.nome}</h2>
              <h4 class="matricula">${element.matricula}</h4>
              <div class="qrcode">
                <img src="https://api.qrserver.com/v1/create-qr-code/?data=${element.matricula}&size=100x100&ecc=H&bgcolor=6fdc8c" />
              </div>
            </div>`
            )
            .join("")}
        </div>
      </body>
    </html>
    `;

    const file = await printToFileAsync({
      html: html,
      base64: false,
      margins: {
        left: 15,
        top: 15,
        right: 15,
        bottom: 15,
      },
    });
    await shareAsync(file.uri);
    setIsExecuting(false);
    Toast.show("Obrigado por aguardar 🤗", {
      position: 150,
      duration: 2000,
      backgroundColor: "#6FDC8C",
      textColor: "#000000",
    });
  }

  return (
    <View style={styles.container}>
      <Text>Busque Planilha Para Cadastro de Colaboradores</Text>

      <Pressable style={styles.button} onPress={handleDocument}>
        <Text>Importar Excel</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={handleArchive}>
        <Text>Gere os Crachás</Text>
      </Pressable>

      <Spinner
        visible={isExecuting}
        textContent="Por favor aguarde, estamos gerando os crachá ⌛"
        textStyle={styles.spinnerTextStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#6FDC8C",
    margin: 10,
  },
  spinnerTextStyle: { color: "#000" },
});
