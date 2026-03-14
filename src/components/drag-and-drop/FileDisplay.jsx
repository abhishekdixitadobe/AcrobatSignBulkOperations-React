import { TableView, TableHeader, TableBody, Row, Cell, ActionButton, Column } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style";
import Close from "@react-spectrum/s2/icons/Close";


const FileDisplay = ({ filledSrc, handleRemoveIndividualClick }) => {
  return (
    <div
      className={style({
        display: "flex",
        justifyContent: "center",
        height: "full"
      })}>
      <TableView aria-label="File Display" styles={style({
        width: 400
      })}>
        <TableHeader>
          <Column id="filename" align="start" isRowHeader={true}>
            File Name
          </Column>
          <Column id="remove" styles={style({
            maxWidth: 80
          })} />
        </TableHeader>
        <TableBody>
          {filledSrc.map((file, index) => (
            <Row id={index} key={index}>
              <Cell>{file.name}</Cell>
              <Cell>
                <ActionButton
                  onPress={() => handleRemoveIndividualClick(index)}
                  isQuiet
                >
                  <Close />
                </ActionButton>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </div>
  );
};

export default FileDisplay;
